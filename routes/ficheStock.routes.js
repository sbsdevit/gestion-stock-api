const router = require('express').Router();
const ficheStockControllers =require('../controllers/ficheStock.controllers');

// Recuperation des données initiales
router.get('/', ficheStockControllers.get_init_fiche_data);

// Recuperation des données globales de la fiche de stock
router.get('/mouvement', ficheStockControllers.get_all_produit_fiche_stock_data);

module.exports = router;