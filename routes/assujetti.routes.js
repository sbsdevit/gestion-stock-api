// Routes pour les requete de la table assujetti

const router = require('express').Router();
const {getGlobalPool} = require('../models');
const { getAssujettiTableNameFromNumDef, getAssujettiByNumDef } = require('../utils/helpers');
const pool = getGlobalPool();

// Recuperation des données d'un assujetti
router.post('/by_def/:num_def', async (req, res, next) => {
    try {
        const numDef = req.body.numero_def;
       const assujetti = await getAssujettiByNumDef(numDef);
        if (!assujetti) {
            return next({
                status: 200,
                state: 'not exists',
                message: "Numéro def incorrect"
            });
        }
        return res.json(assujetti);
    } catch (err) {
        next(err);
    }
});

module.exports = router;