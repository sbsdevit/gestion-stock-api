/**
 * Validation des données pour les requêtes de gestion de stock
 */

const { body, param, validationResult } = require("express-validator");
// const { db } = require("../server");
// const assujettiDb = db.assujettiDb;
// const Produit = assujettiDb ? assujettiDb.produit : {};

// Fonction de verification du resultat de validation
const getValidationResult = (req, res, next) => {
	const errors = validationResult(req);

	if (errors.isEmpty()) {
		return next();
	}

	res.status(400).json({
		message: "Validation errors",
		errors: errors.array(),
	});
};

// Validation des données de la création d'une entrée en stock produit
exports.valider_entree_uniproduit = [
	param("produitId").custom((value) => {
		return Produit.findByPk(value).then((produit) => {
			if (!produit) {
				return Promise.reject("Mauvais id du produit.");
			}
		});
	}),
	body("quantite")
		.isNumeric()
		.withMessage("La quantité est une valeur numéque."),
	body("cout_unitaire")
		.isNumeric()
		.withMessage("Le coût unitaire est une valeur numéque."),
	body("provenance")
		.escape()
		.trim()
		.isLength({ min: 1 })
		.withMessage(
			"Mauvaise valeur pour la provenance des marchandises/produits"
		),
	getValidationResult,
];

// Validation des entrées des produits achetés
exports.valider_entree_facture = [
    param('idFactureAchat')
    .custom((value, {req}) => {
        // Recuperation de la bd
        const bd = req.assujettiDb;
        const FactureAchatTab = bd.factureAchat;
        return FactureAchatTab.findByPk(value).then(facture => {
            if (!facture) {
                return Promise.reject("Mauvais id de la facture.")
            }
        });
    }),
    getValidationResult,
]
