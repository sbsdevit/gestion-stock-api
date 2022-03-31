'use strict'
// Modele pour les factures d'achat

const {Model} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class factureAchat extends Model {
        static associate(models) {
            this.hasMany(models.produitAchete, {foreignKey: 'factureId'});
        }
    }

    factureAchat.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        reference_facture: {
            type: DataTypes.STRING(50),
        },
        quantite_total: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        prix_ttc: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        mode_payement: {
            type: DataTypes.STRING(20),
            allowNull: false,
            defaultValue: 'Cash'
        },
        approvisionnee: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        validee: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
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
        numero_def_fournisseur: {
            type: DataTypes.STRING(50),
        },
        raison_sociale_fournisseur: {
            type: DataTypes.STRING
        },
        sigle_fournisseur: {
            type: DataTypes.STRING
        },
        date_emission: {
            type: DataTypes.DATE,
            allowNull: false
        }
    }, {sequelize, tableName: 'factures_achat', freezeTableName: true});

    return factureAchat;
}