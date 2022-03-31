'use strict'

// Modèle de la table autres_taxes

const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class autresTaxes extends Model {
        static assoctiate(models) {
            this.belongsTo(models.produit, {foreignKey: 'produitId'});
        }
    }

    autresTaxes.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        nom_taxe: {
            type: DataTypes.STRING(30),
            allowNull: false
        },
        pourcentage_taxe: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        produitId: {
            type: DataTypes.UUID,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'autres_taxes',
        freezeTableName: true
    });

    return autresTaxes;
}