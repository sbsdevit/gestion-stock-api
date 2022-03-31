'use strict';
/**
 * Modèle de la table produit
 */

const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class produit extends Model {

        // Création des associations entre la table produit et les table associées        
        static associate (models) {
            this.belongsTo(models.categorie_produit);
            this.belongsToMany(models.client, {through: models.vente});
            this.hasMany(models.vente);
            this.belongsToMany(models.fournisseur, {through: models.entree});
            this.hasMany(models.entree);
            this.hasMany(models.autres_taxes);
        }
    }

    // Initialisation du modèle
    produit.init({
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        designation: {
            type: DataTypes.STRING(150),
            allowNull: false
        },
        code_produit: {
            type: DataTypes.STRING(10),
        },
        description: {
            type: DataTypes.STRING(250),
        },
        fabricant: {
            type: DataTypes.STRING(50),
        },
        marque: {
            type: DataTypes.STRING(50),
        },
        type: {
            type: DataTypes.STRING(50),
        },
        unite: {
            type: DataTypes.STRING(30),
            allowNull: false
        },
        conteneur: {
            type: DataTypes.STRING(30),
        },
        quantite: {
            type: DataTypes.FLOAT,
            defaultValue: 0
        },
        quantite_min: {
            type: DataTypes.FLOAT,
        },
        marge: {
            type: DataTypes.FLOAT
        },
        disponible: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        url_image: {
            type: DataTypes.STRING
        },
        quantite_max: {
            type: DataTypes.FLOAT,
        },
    }, {
        sequelize,
        modelName: 'produit'
    })

    return produit;
}