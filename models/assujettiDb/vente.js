'use strict'

/**
 * Creation du modele pour la table des sortie
 */

const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class vente extends Model {
        static associate(models) {
            // this.belongsTo(models.client, {foreignKey: 'numero_def_client'});
            this.belongsTo(models.produit, {foreignKey: 'produitId'});
            this.belongsToMany(models.entree, {through: models.stockVendu});
            this.hasMany(models.stockVendu);
        }
    }

    vente.init({
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
        },
        reference_facture: {
            type: DataTypes.STRING(20),
            allowNull: false,
        },
        num_vente: {
            type: DataTypes.INTEGER,
        },
        quantite_sortie: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        prix_unitaire: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        tva: {
            type: DataTypes.FLOAT,
            defaultValue: 0,
            allowNull: false
        },
        mode_payement: {
            type: DataTypes.STRING(20),
            allowNull: false,
            defaultValue: 'Cash'
        },
        etat_facture: {
            type: DataTypes.STRING(20),
            allowNull: false,
            defaultValue: 'soldé'
        },
        taux_facture: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        devise: {
            type: DataTypes.STRING(10),
            allowNull: false
        },
        numero_def_client: {
            type: DataTypes.STRING(50),
        }
    }, {
        sequelize, 
        modelName: 'vente',
    });

    return vente;
}