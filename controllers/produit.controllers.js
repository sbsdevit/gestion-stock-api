
// Recuperer les catégorie des produits
exports.get_categories = async (req, res, next) => {
	try {
		// Recuperer la connection à la base des données.
		const db = req.assujettiDb;
		const Cat = db.categorie_produit;
		// Recuperer les catégories.
		const categories = await Cat.findAll();
		// Renvoie de la reponse
		return res.json(categories);
	} catch (err) {
		// Renvoie de l'erreur aux middlewares de  gestion d'erreur.
		next(err);
	}
};

// Nouvelle catégorie des produits
exports.creer_categories = async (req, res, next) => {
	try {
		// Recuperer la connection à la base des données.
		const db = req.assujettiDb;
		const Cat = db.categorie_produit;
		// nouvelle catégorie.
		const data = req.body;
		const categorie = await Cat.create({
			nom_categorie: data.nom,
			code_categorie: data.code,
			description_categorie: data.description,
		});

		// Renvoie de la reponse
		return res.json({
			state: "success",
			categorie,
		});
	} catch (err) {
		// Renvoie de l'erreur aux middlewares de  gestion d'erreur.
		next(err);
	}
};

// Recuperation des produits de l'entreprise
exports.get_produits = async (req, res, next) => {
	try {
		// Recuperer la connection à la base des données.
		const db = req.assujettiDb;
		const Prod = db.produit;
		// Recuperer les produits.
		const produits = await Prod.findAll();
		// Renvoie de la reponse
		return res.json(produits);
	} catch (err) {
		// Renvoie de l'erreur aux middlewares de  gestion d'erreur.
		next(err);
	}
};

// Recuperation d'un seul produit
exports.get_single_produit = async (req, res, next) => {
	try {
		const produitId = req.params.produitId;
		// Recuperer la connection à la base des données.
		const db = req.assujettiDb;
		const Prod = db.produit;
		// Recuperer les produits.
		const produit = await Prod.findByPk(produitId);
		// Renvoie de la reponse
		if (!produit) {
			return next({
				status: 404,
				message: "Aucun produit ne correspond",
			});
		}
		return res.json(produit);
	} catch (error) {
		// Renvoie de l'erreur aux middlewares de  gestion d'erreur.
		next(error);
	}
};

// Creation d'un produit
exports.creer_produit = async (req, res, next) => {
	try {
		// bd
		const bd = req.assujettiDb;
		const Cat = bd.categorie_produit;
		const Prod = bd.produit;
		const Taxe = bd.taxe;
		// Données envoyées
		const data = req.body;
		// Verification de la catégorie
		let categorie;
		if (data.categorieId) {
			categorie = await Cat.findByPk(data.categorieId);

			if (!categorie) {
				return next({
					status: 400,
					message: "La catégorie est incorrecte",
				});
			}
		}
		// Teste du nom de produit
		let prod = await Prod.findOne({
			where: {
				designation: data.designation,
			},
		});
		if (prod) {
			return next({
				status: 200,
				message: "Ce nom de produit est déjà utilisé.",
			});
		}

		// Teste du code produit
		prod = await Prod.findOne({
			where: {
				code_produit: data.code_produit,
			},
		});
		if (prod) {
			return next({
				status: 200,
				message: "Ce code de produit est déjà utilisé.",
			});
		}

		// Nouveau produit
		const produit = await Prod.create({
			designation: data.designation,
			code_produit: data.code_produit,
			unite: data.unite,
			quantite_min: parseFloat(data.q_min),
			quantite: parseFloat(data.quantite),
			marge: parseFloat(data.marge),
			description: data.description,
			numero_compte: data.numCompte,
			categorieProduitId: categorie ? categorie.id : null,
		});

		// Enregistrement des taxes liées au produit
		const taxes = data.taxes;
		const prodTaxes = [];
		if (taxes && taxes instanceof Array) {
			for (let taxe of taxes) {
				const t = await Taxe.create({
					nom_taxe: taxe.label,
					pourcentage_taxe: taxe.pourcentage,
					produitId: produit.id,
				});

				prodTaxes.push(t);
			}
		}
		// Renvoie des resultats
		return res.json({
			state: "success",
			produit: {
				...produit.dataValues,
				taxes: prodTaxes,
			},
		});
	} catch (err) {
		// Renvoie de l'erreur aux middlewares de  gestion d'erreur.
		next(err);
	}
};

