const router = require('express').Router();
const venteController = require('../controllers/vente.controller');

// Recuperer les données initiales des entées
router.get('/data', venteController.donnees_initiales);

// Nouvelle vente des produits
router.post('/', venteController.nouvelle_vente, venteController.creer_client_facture_achat);

// Recuperer le nombre des ventes pour un assujetti
router.get('/count', async (req, res,next) => {
    try {
        // bd
		const bd = req.assujettiDb;
        const sequelize = bd.sequelize;
        const [results] = await sequelize.query(`
                SELECT COUNT(distinct reference_facture) as nbre_facture 
                FROM ventes 
            `
        );

        let count;
        if (results.length > 0) {
            count = results[0].nbre_facture;
        }

        return res.json({
            count: count
        });
    } catch (err) {
        next(err);
    }
});

// Recuperer une facture
router.get('/factures/:referenceFacture', venteController.get_single_facture);

// Recuperer La facture recente
router.get('/facture_recente', venteController.get_facture_recente)

module.exports = router;