const router = require('express').Router();

// Recuperation des données de l'utilisateur
router.get('/', (req, res, next) => {
    try {
        // données de la requête au niveau global
        const user = req.user;
        const assujetti = req.assujetti;
    
        // Renvoie des données 
        return res.json({
            connected: (user && assujetti) ? true : false,
            assujetti,
            user
        });
    } catch (error) {
        next(error);
    }
});

// exportation du module
module.exports = router;
