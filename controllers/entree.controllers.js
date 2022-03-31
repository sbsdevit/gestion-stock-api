const {generate_reference} = require('../utils/helpers');
// Entrée des produits en stock du produit
exports.entree_stock = async (req, res, next) => {
	try {
		// bd
		const bd = req.assujettiDb;
        const Prod = bd.produit;
        const Entree = bd.entree;
        // Données envoyées
		const produitId = req.params.produitId;
		const data = req.body;

        // Verification de l'id du produit
		const produit = await Prod.findOne({
			where: { id: produitId },
		});
		if (!produit) {
			return next({
				message: "Aucun produit ne correspond.",
			});
		}

        // Autres données
		let licence_url = null;
		let factureId = null;
		if (data.provenance === "licence") {
			if (data.licence_url === "" || !data.licence_url)
				return next({
					message: "L'url de la licence d'importation est requise",
				});

			licence_url = data.licence_url;
		} else if (data.provenance === "facture") {
			if (data.factureId === "" || !data.factureId)
				return next({ message: "L'id de la facture est requise" });

			factureId = data.factureId;
		} else if (data.provenance !== "interne") {
			return next({
				message:
					"Mauvaise valeur pour la provenance des marchandises/produits.",
			});
		}

        // Num de l'entrée
		const nbreEntree = await Entree.count();
		const num_entree = data.num_entree || nbreEntree + 1;
		const reference_bon_entree = generate_reference('entree', nbreEntree); //'e1p' + nbreEntree + '' + new Date().getDay()
        // Reduction de la marge
		const marge = (data.marge || produit.marge) / 100;
		const pvU = data.pv_unitaire
			? parseFloat(data.pv_unitaire)
			: parseFloat(data.cout_unitaire) * (parseFloat(marge) + 1);

        // Nouvelle entrée
		const e = await Entree.create({
			reference_bon_entree,
			produitId,
			date_expiration: data.date_exp,
			num_entree: num_entree,
			label_entree: data.label,
			quantite_entree: parseFloat(data.quantite),
			cout_unitaire: parseFloat(data.cout_unitaire),
			pv_unitaire: pvU,
			solde: parseFloat(data.quantite),
			marge: parseFloat(marge),
			devise_entree: data.devise,
			taux_entree: parseFloat(data.taux),
			provenance: data.provenance,
			licence_url: licence_url,
		});

        // Mise à jour du produit
		await Prod.update(
			{ quantite: produit.quantite + e.quantite_entree },
			{
				where: {
					id: produit.id,
				},
			}
		);

        // Recuperation de toutes les données de l'entrée en cours
		const entree = await Entree.findByPk(e.id, {
			include: [{ model: Prod, as: "produit" }],
		});

        // Retour des resultats
		return res.json({
			state: "success",
			entree,
		});
	} catch (err) {
		next(err);
	}
};

// Entrée des produits en stock du produit
exports.entree_facture_achat = async (req, res, next) => {
	try {
		// bd
		const bd = req.assujettiDb;
        const Prod = bd.produit;
        const Entree = bd.entree;
		const factureId = req.params.idFactureAchat;
		const FactureAchatTab = bd.factureAchat;
        // Données envoyées
		const data = req.body;
		// Recuperation de la facture
		const factureAchat = await FactureAchatTab.findByPk(factureId);
		// Verification de la facture
		if (!factureAchat) {
			return res.json({
				status: 400,
				message: "Mauvais id de la facture."
			});
		}

		if (!data || !(data.produits instanceof Array)) {
			return next({
				status: 400,
				message: "Mauvais format des données."
			});
		}

        // Verification de l'id des produits
		for(let prod of data.produits) {
			const produit = await Prod.findOne({
				where: { id: prod.id },
			});
			if (!produit) {
				return next({
					message: "Mauvaise sélection des produits.",
				});
			}
		};

		// Num de l'entrée
		const nbreEntree = await Entree.count();
		let num_entree = nbreEntree + 1;
		const entrees = [];
		for (let produit of data.produits) {
			num_entree = num_entree + 1;	
			// Nouvelle entrée
			const e = await Entree.create({
				produitId: produit.id,
				date_expiration: produit.date_exp,
				num_entree: num_entree,
				label_entree: produit.designation,
				quantite_entree: parseFloat(produit.quantite),
				cout_unitaire: parseFloat(produit.cout_u),
				pv_unitaire: produit.pv_unitaire,
				solde: parseFloat(produit.quantite),
				marge: parseFloat(produit.marge),
				devise_entree: data.devise,
				taux_entree: parseFloat(data.taux),
				provenance: "facture",
				factureId: factureId,
			});
			// Mise à jour du produit
			await Prod.increment(
				{ quantite: e.quantite_entree },
				{
					where: {
						id: produit.id,
					},
				}
			);
			// Recuperation de toutes les données de l'entrée en cours
			const entree = await Entree.findByPk(e.id, {
				include: [{ model: Prod, as: "produit" }],
			});
			entrees.push(entree);
		};

		// Mise à jour de la facture d'achat
		await FactureAchatTab.update({
			approvisionnee: true
		}, {
			where: {
				id: factureId
			}
		})

        // Retour des resultats
		return res.json({
			state: "success",
			entrees,
		});
	} catch (err) {
		next(err);
	}
};

// Recuperation des factures d'achat pour les entrées
exports.get_factures_achats = async (req, res, next) => {
    try {
        // bd
		const bd = req.assujettiDb;
        const FactureAchat = bd.factureAchat;
        const ProduitAchete = bd.produitAchete;
        // Recuperation des factures
        const factures = await FactureAchat.findAll({
            where: {
                approvisionnee: false
            },
            include: [ProduitAchete]
        });
        // Retourner les resultats
        return res.json(factures);
    } catch (err) {
        next(err);
    }
}