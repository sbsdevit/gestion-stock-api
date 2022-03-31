'use strict'

/**
 * Modele pour la table Categorie
 */

const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class categorie extends Model {
        static associate (models) {
            this.hasMany(models.produit);
        }
    }

    categorie.init({
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        nom_categorie: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        code_categorie: {
            type: DataTypes.STRING(30),
            allowNull: false
        },
        description_categorie: {
            type: DataTypes.STRING(150)
        }
    }, {sequelize, modelName: 'categorie_produit', freezeTableName: true});

    return categorie;
}