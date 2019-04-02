const express = require('express');
const router = express.Router();
var connection = require('../connection');

router.post('/createTable', (req, res) => {
	let sql = 'CREATE TABLE IF NOT EXISTS valkyriePrimaryDB.feedback(' +
						'feedbackID INT AUTO_INCREMENT, ' +
						'device_address_sender VARCHAR(40) NOT NULL, ' +
						'device_address_receiver VARCHAR(40) NOT NULL, ' +
						'feedback VARCHAR(240), ' +
						'positive BOOLEAN NOT NULL, ' +
						'timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, ' +
						'PRIMARY KEY (feedbackID), ' +
						'FOREIGN KEY (device_address_sender) REFERENCES valkyriePrimaryDB.userinfotable(device_address), ' +
						'FOREIGN KEY (device_address_receiver) REFERENCES valkyriePrimaryDB.userinfotable(device_address));';
	connection.query(sql, (error, results) => {
		if(error) {
			res.status(500).send({ message: "Failed: " + error});
		}
		else {
			res.status(200).send({ message: "Successful"});
		}
	})
});


router.get('/received', (req, res) => {
	let device_address_receiver = req.query.device_address;
	if (!device_address_receiver) {
		res.status(400).send({ message: 'Failed: Missing device_address_receiver parameter'});
	}

	// Join device_address receiver and receiver on firstname/lastname
	let SQL = 'SELECT ui.first_name, ui.last_name, f.feedback, f.timestamp, f.positive ' +
			  		'FROM valkyriePrimaryDB.userinfotable AS ui ' +
			  		'INNER JOIN valkyriePrimaryDB.feedback AS f ' +
			  		'ON ui.device_address = f.device_address_sender ' +
			  		'WHERE f.device_address_receiver = ?;';
	connection.query(SQL, [device_address_receiver], (error, results) => {
		if (error) {
			res.status(500).send({ message: 'Failed:' + error});
		}
		else {
			res.status(200).send({ message: 'Successful', results : results});
		}
	});
});


router.get('/given', (req, res) => {
	let device_address_sender = req.query.device_address;
	if (!device_address_sender) {
		res.status(400).send({ message: 'Failed: Missing device_address parameter'});
	}

	// Join device_address sender and receiver on firstname/lastname
	let SQL = 'SELECT ui.first_name, ui.last_name, f.feedback, f.timestamp, f.positive ' +
			  		'FROM valkyriePrimaryDB.userinfotable AS ui ' +
			  		'INNER JOIN valkyriePrimaryDB.feedback AS f ' +
			  		'ON ui.device_address = f.device_address_receiver ' +
			  		'WHERE f.device_address_sender = ?;';
	connection.query(SQL, [device_address_sender], (error, results) => {
		if (error) {
			res.status(500).send({ message: 'Failed:' + error})
		}
		else {
			res.status(200).send({ message: 'Successful', results : results});
		}
	});
});

router.post('/send', (req, res) => {
	let device_address_sender = req.body.device_address_sender;
	let device_address_receiver = req.body.device_address_receiver;
	let feedback = req.body.feedback;
	let positive = req.body.positive;
	if (!device_address_sender || !device_address_receiver || !feedback) {
		res.status(400).send({ message: 'Failed: Required arguments are device_address_sender, device_address_receiver, feedback, and positive.'});
		return;
	}
	if (typeof positive === 'undefined' || positive === null) {
		res.status(400).send({ message: 'Failed: positive argument missing - must be a bool.'});
		return;
	}

	// Join device_address sender and receiver on firstname/lastname
	let SQL = 'INSERT INTO valkyriePrimaryDB.feedback (device_address_sender, device_address_receiver, feedback, positive) ' +
			  		'VALUES ( ?, ?, ?, ?);';
	connection.query(SQL, [device_address_sender, device_address_receiver, feedback], (error, results) => {
		if (error) {
			res.status(500).send({ message: 'Failed:' + error})
		}
		else {
			res.status(200).send({ message: 'Successful',
							results : results});
		}
	});
});

module.exports = router;
