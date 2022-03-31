// Controlleurs pour les requete de la vente

const { Op } = require("sequelize");
const { getAssujettiByNumDef, getVenteFacture, generate_reference } = require("../utils/helpers");
const getDatabase = require('../models/assujettiDb');

// Recuperation des données necessaire à la vente
exports.donnees_initiales = async (req, res, next) => {
	try {
		// bd
		const bd = req.assujettiDb;
        const Prod = bd.produit;
        const Entree = bd.entree;
		const produits = await Prod.findAll({
			include: {
				model: Entree,
				where: {
					solde: { [Op.gt]: 0 },
				},
				required: false,
			},
		});

		return res.json(produits);
	} catch (error) {
		next(error);
	}
};

// Nouvelle vente des produits
exports.nouvelle_vente = async (req, res, next) => {
	try {
		// bd
		const bd = req.assujettiDb;
		const sequelize = bd.sequelize;
        const Prod = bd.produit;
        const Vente = bd.vente;
        const Entree = bd.entree;
		const Client = bd.client;
		const VStock = bd.stockVendu;
		// Données de la requete
		const data = req.body;
		let clientDef = data.clientDef;

		// Verification du client
		if (clientDef) {
			const c = await getAssujettiByNumDef(clientDef);

			if (!c) {
				return next({
					status: 200,
					message: "Client non enregistré",
				});
			}
		}

		const [result] = await sequelize.query(`
			SELECT count(distinct reference_facture) as nbre_f
			FROM ventes
		`);

		let count = 0;
		if (result.length > 0) {
			count = result[0].nbre_f;
		}

		// Creation Facture
		const factureRef = generate_reference('facture', count); //data.refFacture || count + 1;

		// // Creation Vente
		const venteData = data.ventes;
		let vStock = [];
		let prod;

		for (let vente of venteData) {
			// Creation de la vente
			const v = await Vente.create({
				reference_facture: factureRef,
				num_vente: count + 1,
				quantite_sortie: vente.q_sortie,
				prix_unitaire: vente.prix_unitaire,
				tva: vente.tva || vente.q_sortie * vente.prix_unitaire * 0.16,
				etat_facture: data.etat_facture,
				taux_facture: data.taux,
				devise: data.devise,
				autre_taxes: vente.autre_taxes,
				mode_payement: data.mode_payement,
				produitId: vente.produitId,
				numero_def_client: clientDef,
			});

			// Creation des stocks vendus
			vStock = vente.venteStock.map((vs) => ({
				...vs,
				venteId: v.id,
			}));

			await VStock.bulkCreate(
				vStock.map(({ q_entree, q_sortie, ...vs }) => {
					return { ...vs, q_vendue: q_sortie };
				})
			);

			/**
			 *  Mise à jour des quantité
			 */

			// Produit
			prod = await Prod.findByPk(v.produitId);

			await Prod.update(
				{ quantite: prod.quantite - v.quantite_sortie },
				{
					where: {
						id: prod.id,
					},
				}
			);

			// Entrees
			for (vs of vente.venteStock) {
				await Entree.update(
					{ solde: vs.q_entree },
					{
						where: {
							id: vs.entreeId,
						},
					}
				);
			}
		}

		const facture = await getVenteFacture(factureRef, bd);

		return next(facture);
	} catch (err) {
		next(err);
	}
};

// Créer facture achat pour client
exports.creer_client_facture_achat = async (facture, req, res, next) => {
	try {
		// Verification de la fature de vente
		if (!facture) {
			return res.json({
				message: "Aucune facture de vente",
			});
		}
		// Recuperation du numero def du client
		const client = facture.clientDef;
		if (!client) {
			return res.json({
				state: "success",
				facture: facture,
			});
		}
		// Recupertion de la bd du client
		const dbName = "def_" + client.replaceAll("/", "").replaceAll("-", "").toLowerCase();
		const bd = getDatabase(dbName);
		const FactureAchatTab = bd.factureAchat;
		const ProdAcheteTab = bd.produitAchete;

		// Creation de la facture d'achat
		const fact = await FactureAchatTab.create({
			reference_facture: facture.num_facture,
			quantite_total: facture.total_quantite,
			prix_ttc: facture.total_ht + facture.total_tva,
			numero_def_fournisseur: req.assujetti.numero_def,
			sigle_fournisseur: req.assujetti.sigle,
			raison_sociale_fournisseur: req.assujetti.raison_sociale,
			date_emission: facture.date,
			mode_payement: facture.mode_payement,
			etat_facture: facture.etat_facture,
			taux_facture: facture.taux_facture,
			devise: facture.devise,
		});

		// Creation des produit achetes
		const produits = facture.produits.map(p => ({
			designation: p.designation,
			fabricant: p.fabricant,
			marque: p.marque,
			unite: p.unite,
			conteneur: p.conteneur,
			quantite: p.q_sortie,
			prix_ht: p.total,
			factureId: fact.id
		}));
		await ProdAcheteTab.bulkCreate(produits);

		// Renvoie de la facture
		return res.json({
			state: "success",
			facture: facture,
		});

	} catch (err) {
		next(err);
	}
}

// Recuperation d'une facture par le numero ou la reference
exports.get_single_facture = async (req, res, next) => {
	try {
		// bd
		const bd = req.assujettiDb;
		// Recuperation de la facture
		const facture = await getVenteFacture(req.params.referenceFacture, bd);
		// Renvoie de la facture
		return res.json(facture);
	} catch (err) {
		next(err);
	}
};

// Recuperation de la facture recemment enregistrée
exports.get_facture_recente = async (req, res, next) => {
	try {
		// bd
		const bd = req.assujettiDb;
        const Vente = bd.vente;
		// Recuperation de la reference de la facture recente
		const ventes = await Vente.findAll({
			order: [["createdAt", "DESC"]],
			limit: 100,
		});
		if (ventes.length > 0) {
			const now = new Date();
			const fDate = new Date(ventes[0].createdAt);
			// Verification de la data
			if (
				now.getFullYear() === fDate.getFullYear() &&
				now.getMonth() === fDate.getMonth() &&
				now.getDate() === fDate.getDate()
			) {
				// Reconstitution de la facture
				const facture = await getVenteFacture(ventes[0].reference_facture, bd);
				return res.json({ facture });
			}
		}
		return res.json(null);
	} catch (err) {
		next(err);
	}
};