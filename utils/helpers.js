// const db = require("../server");
const { getGlobalPool } = require("../models");
const pool = getGlobalPool();

/**
 * Recupere les données de l'assujetti connecté et les retourne
 * @param {string} tabName Le nom de la table de la bd
 * @param {string} numDef Le numéro def de l'assujetti
 * @returns Assujetti object or null
 */
exports.getAssujetti = async (tabName, numDef) => {
	try {
		const [resultat] = await pool.query(`
			SELECT * FROM ${tabName} WHERE numero_def='${numDef}'
		`);

		const assujetti = resultat[0];

		return assujetti;
	} catch (err) {
		console.log(err);
	}
};

/**
 * Recupere l'agent utilisateur de la bd de l'assujetti
 * @param {object} db database object
 * @param {string} idUser
 * @returns Agent
 */
exports.getUser = async (dbtable, idUser) => {
	const user = await dbtable.findOne({
		where: {
			nomsession: idUser,
		},
		attributes: {
			exclude: "motdepasse",
		},
	});
	if (user) {
		return user.dataValues;
	}
	return user;
};

/**
 * Generate the table name from the numero_def
 * @param {string} numero_def
 * @returns String name of the db table.
 */
exports.getAssujettiTableNameFromNumDef = (numeroDef) => {
	const numero_def = numeroDef;
	if (typeof numero_def !== "string") return;
	const sub = numero_def.toLowerCase().split("/")[0];
	let table = "";
	switch (sub) {
		case "pmc":
			table = "personne_morale_commercante";
			break;
		case "ppc":
			table = "personne_physique_commercante";
			break;
		case "pmnc":
			table = "personne_morale_non_commercante";
			break;
		case "ppnc":
			table = "personne_physique_non_commercante";
			break;
		default:
			break;
	}

	return table;
};

/**
 * Recupere les données d'un assujetti par son num def
 * @param {string} numDef Num def de l'assujetti
 * @returns Resultat de la requête
 */
exports.getAssujettiByNumDef = async (numDef) => {
	const pool = getGlobalPool();
	const table = this.getAssujettiTableNameFromNumDef(numDef);
	if (table && table !== "") {
		const [results] = await pool.query(`
				SELECT * FROM ${table} WHERE numero_def='${numDef}'
			`);

		return results[0];
	}
	return null;
};

/**
 * Recupere une facture de vente
 * @param {string} refFacture Reference de la facture
 * @returns facture object ou bien null
 */
exports.getVenteFacture = async (refFacture, bd) => {
	// bd
	if (!bd || !bd.sequelize) throw Error("Erreur de base des données.");
	const sequelize = bd.sequelize;
	// Recuperation des ventes d'une facture
	const [ventes] = await sequelize.query(`
		SELECT b.designation, 
		a.reference_facture,
		a.numero_def_client as clientDef,
		a.mode_payement,
		a.taux_facture,
		a.devise,
		a.etat_facture,
		sum(a.quantite_sortie) as q_sortie, 
		sum(a.quantite_sortie * a.prix_unitaire) as total,
		sum(a.tva) as tva,
		a.createdAt as date,
		b.fabricant as fabricant,
		b.marque as marque,
		b.unite as unite,
		b.conteneur as conteneur
		FROM ventes as a, (
		SELECT * 
		FROM produits
		) as b
		WHERE a.produitId = b.id and reference_facture = '${refFacture}'
		group by a.produitId, 
		a.reference_facture,
		a.numero_def_client,
		a.mode_payement,
		a.taux_facture,
		a.devise,
		a.etat_facture,
		a.createdAt,
		b.fabricant,
		b.marque,
		b.unite,
		b.conteneur;
	`);
	if (ventes.length > 0) {
		let total_ht = 0;
		let total_tva = 0;
		let total_quantite = 0;
		// Calcule du prix total et de la qté sortie
		for (let v of ventes) {
			total_ht += v.total;
			total_tva += v.tva;
			total_quantite += v.q_sortie;
		}
		// Client
		let client;
		if (ventes[0].clientDef) {
			client = await this.getAssujettiByNumDef(ventes[0].clientDef);
		}
		// Reconstitution de la facture
		const facture = {
			num_facture: ventes[0].reference_facture,
			mode_payement: ventes[0].mode_payement,
			taux_facture: ventes[0].taux_facture,
			devise: ventes[0].devise,
			etat_facture: ventes[0].etat_facture,
			date: ventes[0].date,
			total_ht,
			total_tva,
			total_quantite,
			clientDef: ventes[0].clientDef,
			client: client,
			produits: ventes.map((p) => ({
				designation: p.designation,
				q_sortie: p.q_sortie,
				prix_unitaire: p.total / p.q_sortie,
				total: p.total,
				tva: p.tva,
				conteneur: p.conteneur,
				marque: p.marque,
				fabricant: p.fabricant,
				unite: p.unite,
			})),
		};
		// Renvoie de la facture
		return facture;
	}
	// Renvoie de null;
	return null;
};

/**
 * Compares two date
 * @param {date} a First date
 * @param {date} b Second date
 * @returns (a > b) - (a < b) or NAN if either a or be is not in a good Date format
 */
exports.dateCompare = (a, b) => {
	let x = a,
		y = b;
	x = new Date(x).valueOf();
	y = new Date(y).valueOf();
	return isFinite(x) && isFinite(y) ? (x > y) - (x < y) : NaN;
};

/**
 * Receives a data array of object and sort it by the date attribute in a Ascending way.
 * @param {array} data The array to sort.
 * @param {string} colName The string name of the attribute containing the date.
 * @returns Sorted data array.
 */
exports.sort_asc_bydate = (data, colName) => {
	if (!(data instanceof Array)) {
		throw new Error("Data is not array");
	}
	if (data.some((d) => !d[colName])) {
		throw new Error("Some data don't have the attribute " + colName);
	}

	// Create and Return the sorted array
	const sD = data.sort((a, b) => this.dateCompare(a[colName], b[colName]));
	return sD;
};

/**
 * Gets a type string and a count number and generate a data refence
 * @param {string} type The type of the reference
 * @param {number} count The number of references
 * @returns The reference string
 */
exports.generate_reference = (type, count) => {
	if (typeof type !== "string")
		throw new Error("Reference type is not a string");
	if (typeof count !== "number") throw new Error("The count is not a number");
	return type[0] + count + "" + new Date().getDate() + new Date().getMonth();
};
