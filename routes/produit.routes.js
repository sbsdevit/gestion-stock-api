// Accès aux controlleurs produit

const router = require('express').Router();
const produitConterollers = require('../controllers/produit.controllers');
// Recuperation des catégorie des produits
router.get('/categories', produitConterollers.get_categories);

// Recuperation des catégorie des produits
router.post('/categories', produitConterollers.creer_categories);

// Recuperation de tous les produits et création d'un produit
router
.route('/')
.get(produitConterollers.get_produits)
.post(produitConterollers.creer_produit);

// Recuperation d'un seul produit
router.get('/:produitId', produitConterollers.get_single_produit);


// Exportation du module
module.exports = router;