/**
 * Validation des données pour les requêtes de gestion de stock
 */

const {body, param, validationResult} = require('express-validator');
const {db} = require('../server');
const assujettiDb = db.assujettiDb;
const Produit = assujettiDb ? assujettiDb.produit : {};

// Fonction de verification du resultat de validation
const getValidationResult = (req, res, next) => {
    const errors = validationResult(req);

    if (errors.isEmpty()) {
        return next();
    }

    res.status(400).json({
        message: 'Validation errors',
        errors: errors.array()
    })
}

// Validation de la creation des stock
exports.valider_creation_stock = [
    body('nom_stock')
    .trim()
    .escape()
    .isLength({min: 1})
    .withMessage("Le nom du stock est obligatoire."),
    body('localite')
    .trim().escape(),
    getValidationResult
];


// Validation de la creation d'un produit
exports.valider_creation_produit = [
    body('designation')
    .trim()
    .escape()
    .isLength({min: 1, max: 150})
    .withMessage('La désignation d\'un produit est une valeur réquise et a une taille inférieur à 150 caractères.'),
    body('unite')
    .trim()
    .escape()
    .isLength({min: 1, max: 30})
    .withMessage('L\'unité de mésure d\'un produit est une valeur réquise et a une taille inférieur à 30 caractères.'),
    body('q_min')
    .isNumeric()
    .withMessage('La quantité minimale est toujours numérique.'),
    body('marge')
    .isNumeric()
    .withMessage('La marge bénéficiaire est toujours numérique.'),
    getValidationResult
]

// Validation des données de la création d'une entrée en stock produit
exports.valider_entree = [
    param('produitId')
    .custom(value => {
        return Produit.findByPk(value).then(produit => {
            if (!produit) {
                return Promise.reject("Mauvais id du produit.")
            }
        })
    }),
    body('quantite')
    .isNumeric()
    .withMessage("La quantité est une valeur numéque."),
    body('cout_unitaire')
    .isNumeric()
    .withMessage("Le coût unitaire est une valeur numéque."),
    body('provenance')
    .escape()
    .trim().isLength({min: 1}).withMessage("Mauvaise valeur pour la provenance des marchandises/produits"),
    getValidationResult
];

// Validation des données de création d'une catégorie des produits
exports.valider_categorie_data = [
    body('nom').trim().escape().isLength({min: 1}).withMessage("Le nom de la catégorie est réquis."),
    body('code').trim().escape().isLength({min: 1}).withMessage("Le code de la catégorie est réquis."),
    getValidationResult
]