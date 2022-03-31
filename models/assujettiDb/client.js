'use strict'
const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class client extends Model {
        static associate(models) {
            // this.belongsToMany(models.produit, {through: models.vente});
            // this.hasMany(models.vente);
        }
    }

    client.init({
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        numero_def: {
            type: DataTypes.STRING(20),
            allowNull: true,
        },
        compte: {
            type: DataTypes.STRING,
            unique: true
        },
        nom: {
            type: DataTypes.STRING(20),
        },
        address: {
            type: DataTypes.STRING(50)
        }
    }, {sequelize, modelName: 'client'});

    return client;
}