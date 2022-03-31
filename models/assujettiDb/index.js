"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const { DB_USERNAME, DB_PASSWORD, DB_DIALECT, DB_HOST } = process.env;

module.exports = (dbName) => {
	const dbConfigs = {
		development: {
			username: DB_USERNAME,
			password: DB_PASSWORD,
            database: dbName,
			host: DB_HOST,
			dialect: DB_DIALECT,
			logging: false,
		},
		production: {
            username: DB_USERNAME,
			password: DB_PASSWORD,
            database: dbName,
			host: DB_HOST,
			dialect: DB_DIALECT,
			logging: false,
		},
	};
	const config = dbConfigs[env];
	const db = {};

	let sequelize = new Sequelize(
			config.database,
			config.username,
			config.password,
			config
		);

	fs.readdirSync(__dirname)
		.filter((file) => {
			return (
				file.indexOf(".") !== 0 &&
				file !== basename &&
				file.slice(-3) === ".js"
			);
		})
		.forEach((file) => {
			const model = require(path.join(__dirname, file))(
				sequelize,
				Sequelize.DataTypes
			);
			db[model.name] = model;
		});

	Object.keys(db).forEach((modelName) => {
		if (db[modelName].associate) {
			db[modelName].associate(db);
		}
	});

	db.sequelize = sequelize;
	db.Sequelize = Sequelize;

    return db;
};
