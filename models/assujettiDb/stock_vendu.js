'use strict'

/**
 * Creation du modele pour la table des sortie
 */

const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class venteStock extends Model {
        static associate(models) {
            this.belongsTo(models.entree, {foreignKey: 'entreeId'});
            this.belongsTo(models.vente, {foreignKey: 'venteId'});
        }
    }

    venteStock.init({
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
        },
        q_vendue: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        venteId: {
            type: DataTypes.UUID,
            allowNull: false
        },
        entreeId: {
            type: DataTypes.UUID,
            allowNull: false
        },
    }, {
        sequelize, 
        modelName: 'stockVendu',
        // freezeTableName: true

    });

    return venteStock;
}