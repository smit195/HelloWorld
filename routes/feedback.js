const express = require('express');
const router = express.Router();
var connection = require('../connection');


router.post('/feedback/createTable', (req, res) => {
	/*
	let sql = 'CREATE TABLE IF NOT EXISTS valkyriePrimaryDB.feedback(' +
						'feedbackID INT AUTO_INCREMENT, ' +
						'device_address_sender VARCHAR(40), ' +
						'device_address_receiver VARCHAR(40), ' +
						'feedback VARCHAR(240), ' +
						''
						'timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, ' +
						'PRIMARY KEY (feedbackID), ' +
						'FOREIGN KEY (device_address_sender) REFERENCES valkyriePrimaryDB.userinfotable(device_address), ' +
						'FOREIGN KEY (device_address_receiver) REFERENCES valkyriePrimaryDB.userinfotable(device_address));
	connection.query(sql, (error, results) => {
		if(error) {
			response.status(500).send({table_create_status: "Failed: " + error});
		}
		else {
			response.status(200).send({table_create_status: "Successful"});
		}
	})
	*/
	res.send("Created.");
});


router.get('/feedback/received', (req, res) => {
	/*
	let device_address_receiver = req.query.device_address;
	if (!device_address_receiver) {
		res.status(400).send({feedback_given_status : 'Failed: Missing device_address parameter'});
	}

	// Join device_address receiver and receiver on firstname/lastname
	let SQL = 'SELECT ui.first_name, ui.last_name, f.feedback, f.timestamp ' +
			  'FROM valkyriePrimaryDB.userinfotable AS ui ' +
			  'INNER JOIN valkyriePrimaryDB.feedback AS f ' +
			  'ON ui.device_address = f.device_address_sender
			  'WHERE ui.device_address = ?;';
	connection.query(SQL, [device_address_sender],(error, results) => {
		if (error) {
			res.status(500).send({feedback_received_status : 'Failed:' + error})
		}
		else {
			res.status(200).send({feedback_received_status : 'Successful',
							results : results});
		}
	}
	*/
	res.send("Received.");
});


router.get('/feedback/given', (req, res) => {
	/*
	let device_address_giver = req.body.device_address;
	if (!device_address_giver) {
		res.status(400).send({feedback_given_status : 'Failed: Missing device_address parameter'});
	}

	// Join device_address sender and receiver on firstname/lastname
	let SQL = 'SELECT ui.first_name, ui.last_name, f.feedback, f.timestamp ' +
			  'FROM valkyriePrimaryDB.userinfotable AS ui ' +
			  'INNER JOIN valkyriePrimaryDB.feedback AS f ' +
			  'ON ui.device_address = f.device_address_receiver
			  'WHERE ui.device_address = ?;';
	connection.query(SQL, [device_address_giver], (error, results) => {
		if (error) {
			res.status(500).send({feedback_received_status : 'Failed:' + error})
		}
		else {
			res.status(200).send({feedback_received_status : 'Successful',
							results : results});
		}
	}
	*/
	res.send("Given.");
});

router.post('/feedback/send', (req, res) => {
	/*
	let device_address_giver = req.body.device_address_giver;
	let device_address_receiver = req.body.device_address_receiver;
	let feedback = req.body.feedback;
	let positive = req.body.positive;
	if (!device_address_giver || !device_address_receiver || !feedback) {
		res.status(400).send({feedback_insert_status: 'Failed: Required arguments are device_address_giver, device_address_receiver, and feedback.'});
	}
	if (typeof positive === 'undefined' || query === null) {
		
	}

	// Join device_address sender and receiver on firstname/lastname
	let SQL = 'INSERT INTO valkyriePrimaryDB.feedback (device_address_giver, device_address_receiver, feedback) ' +
			  'VALUES ( ?, ?, ?);';
	connection.query(SQL, [device_address_giver, device_address_receiver, feedback], (error, results) => {
		if (error) {
			res.status(500).send({feedback_received_status : 'Failed:' + error})
		}
		else {
			res.status(200).send({feedback_received_status : 'Successful',
							results : results});
		}
	}
	*/
	res.send("send")
});

module.exports = router;
