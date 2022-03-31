'use strict'
// Modele des produits achetés
const {Model} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class produitAchete extends Model {
        static associate(models) {
            this.belongsTo(models.factureAchat, {foreignKey: 'factureId'});
        }
    }
    
    produitAchete.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        designation: {
            type: DataTypes.STRING,
            allowNull: false,
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
            allowNull: false
        },
        prix_ht: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        factureId: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {sequelize, tableName: 'produits_achetes', freezeTableName: true});

    return produitAchete;
}