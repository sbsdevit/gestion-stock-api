'use strict'
/**
 * Creation du modèle de la table des entrées 
 */

const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class entree extends Model {
        static associate (models) {
            this.belongsTo(models.fournisseur, {foreignKey: 'fournisseurId'});
            this.belongsTo(models.produit, {foreignKey: 'produitId'});
            this.belongsToMany(models.vente, {through: models.stockVendu});
            this.hasMany(models.stockVendu);
        }
    }

    entree.init({
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        reference_bon_entree: {
            type: DataTypes.STRING,
            required: true
        },
        num_entree: {
            type: DataTypes.STRING(20),
            allowNull: false
        },
        label_entree: {
            type: DataTypes.STRING(20),
            allowNull: false,
            defaultValue: 'entrée'
        },
        quantite_entree: {
            type: DataTypes.FLOAT,
            allowNull: false,
            defaultValue: 0,
        },
        solde: {
            type: DataTypes.FLOAT,
            defaultValue: 0,
            allowNull: false,
        },
        cout_unitaire: {
            type: DataTypes.DOUBLE,
            defaultValue: 0,
            allowNull: false,
        },
        marge: {
            type: DataTypes.FLOAT,
            defaultValue: 0,
            allowNull: false,
        },
        pv_unitaire: {
            type: DataTypes.DOUBLE,
            defaultValue: 0,
            allowNull: false,
        },
        devise_entree: {
            type: DataTypes.STRING(10),
            allowNull: false
        },
        date_expiration: {
            type: DataTypes.DATE
        },
        taux_fournisseur: {
            type: DataTypes.FLOAT,
            set(val) {
                if (val){
                    this.setDataValue(parseFloat(val))
                }
            }
        },
        provenance: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        licence_url: {
            type: DataTypes.STRING(),
        },
        produitId: {
            type: DataTypes.UUID,
            allowNull: false
        },       
    }, {
        sequelize,
        modelName: 'entree'
    })

    return entree;
}