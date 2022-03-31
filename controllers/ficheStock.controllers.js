const {sort_asc_bydate} = require('../utils/helpers');

// Recuperation des données initiales
exports.get_init_fiche_data = async (req, res, next) => {
    try {
        // Recuperer la connection à la base des données.
		const db = req.assujettiDb;
		const Entree = db.entree;
		const Vente = db.vente;
		const Prod = db.produit;

        // Nombre du nombre des entrées
        const nbreEntrees = await Entree.count();
        // Nombre des sorties ou ventes
        const nbreVentes = await Vente.count();

        // Retour de la réponse http
        return res.json({
            entrees: nbreEntrees,
            sorties: nbreVentes
        });
    } catch (error) {
        next(error);
    }
}

// Recuperation des données de la fiche de tous les stocks
exports.get_all_produit_fiche_stock_data = async (req, res, next) => {
	try {
		// Recuperer la connection à la base des données.
		const db = req.assujettiDb;
		const Entree = db.entree;
		const Sortie = db.vente;
		const Prod = db.produit;
		// Recuperation des paramettres
		const limit = req.query.limit;
		// Recuperer des entrees.
		const entrees = await Entree.findAll({
			order: [['createdAt', 'DESC']],
			raw: true,
			include: [
				{
					model: Prod,
					attributes: ['designation', 'quantite', 'code_produit']
				}
			],
			limit
		});
		// Recuperation des sortie
		const sorties = await Sortie.findAll({
			order: [['createdAt', 'DESC']],
			raw: true,
			include: [
				{
					model: Prod,
					attributes: ['designation', 'quantite', 'code_produit']
				}
			],
			limit
		});
		// Renvoie de la réponse
		const response = sort_asc_bydate([...entrees, ...sorties], 'createdAt');

		return res.json(response);
	} catch (err) {
		// Renvoie de l'erreur aux middlewares de  gestion d'erreur.
		next(err);
	}
};