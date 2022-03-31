'use strict'

/**
 * Modele pour la table agent
 */

const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class agent extends Model {
        static associate (models) {
        }
    }

    agent.init({
        telephone: {
            type: DataTypes.STRING(25),
            primaryKey: true
        },
        matricule: {
            type: DataTypes.STRING(25),
        },
        nomsession: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        nom: {
            type: DataTypes.STRING(250)
        },
        postnom: {
            type: DataTypes.STRING(250)
        },
        prenom: {
            type: DataTypes.STRING(250)
        },
        code_sexe: {
            type: DataTypes.STRING(2)
        },
        adresse: {
            type: DataTypes.STRING(250)
        },
        statut: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        code_fonction: {
            type: DataTypes.STRING(250),
            allowNull: false
        },
        code_categorie: {
            type: DataTypes.STRING(250),
            allowNull: false
        },
        motdepasse: {
            type: DataTypes.STRING(250),
            allowNull: false
        },
    }, {sequelize, modelName: 'agents', freezeTableName: true, timestamps: false});

    return agent;
}