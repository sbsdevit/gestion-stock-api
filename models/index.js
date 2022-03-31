const mysql = require("mysql2/promise");

exports.getGlobalPool = () => {
	try {
		const pool = mysql.createPool({
			host: process.env.DB_HOST,
			user: process.env.DB_USERNAME,
			database: "def_sbs",
			password: process.env.DB_PASSWORD,
			waitForConnections: true,
			connectionLimit: 10,
			queueLimit: 0,
			namedPlaceholders: true,
		});

		return pool;
	} catch (error) {
		console.log(error);
	}
};

exports.getAssujettiPool = (assujettiDbName) => {
	try {
		const pool = mysql.createPool({
			host: process.env.DB_HOST,
			user: process.env.DB_USERNAME,
			database: assujettiDbName,
			password: process.env.DB_PASSWORD,
			waitForConnections: true,
			connectionLimit: 10,
			queueLimit: 0,
			namedPlaceholders: true,
		});

		return pool;
	} catch (error) {
		console.log(error);
	}
};
