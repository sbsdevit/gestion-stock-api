// Accès aux controlleurs produit

const router = require('express').Router();
const entreeControllers = require('../controllers/entree.controllers');
const validators = require('../validators/entree.validators');

// Nouvelle entrée multiple en stock
router.post('/facture/:idFactureAchat', validators.valider_entree_facture, entreeControllers.entree_facture_achat);

// Nouvelle etrée en stock
router.post('/:produitId', entreeControllers.entree_stock);

// Recuperation des factures d'achat pour les entrées
router.get('/factures', entreeControllers.get_factures_achats);

// Exportation du module
module.exports = router;