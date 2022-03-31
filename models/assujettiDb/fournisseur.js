'use strict'
const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class fournisseur extends Model {
        static associate(models) {
            this.belongsToMany(models.produit, {through: models.entree});
            this.hasMany(models.entree);
        }
    }

    fournisseur.init({
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        numero_def: {
            type: DataTypes.STRING(20), 
        },
        nom_fournisseur: {
            type: DataTypes.STRING(20),
            allowNull: false
        },
        numero_compte: {
            type: DataTypes.STRING,
            allowNull: false
        },
        address: {
            type: DataTypes.STRING(50)
        } 
    }, {sequelize, modelName: 'fournisseur'});

    return fournisseur;
};