// This module establishes a singleton database object for querying

const mysql = require('mysql');
var connection;

function connectDatabase() {
	// Singleton connection
	if (!connection) {
		connection = mysql.createConnection({
			host     : process.env.RDS_HOSTNAME,
			user     : process.env.RDS_USERNAME,
			password : process.env.RDS_PASSWORD,
			port     : process.env.RDS_PORT,
			database : process.env.RDS_DBNAME,
			multipleStatements: true
		});

		connection.connect((err) => {
			if (err) {
				console.log('Database failed to connect.');
			}
			else {
				console.log('Database connection successful.');
			}
		});
	}

	return connection;
}

module.exports = connectDatabase();
