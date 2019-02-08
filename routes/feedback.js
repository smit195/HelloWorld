const express = require('express');
const router = express.Router();
var connection = require('../connection');



router.post('/feedback/createTable', (req, res) => {
	/*
	var sql = 'CREATE TABLE IF NOT EXISTS valkyriePrimaryDB.feedback(' +
						'feedbackID INT AUTO_INCREMENT, ' +
						'device_address_sender VARCHAR(40), ' +
						'device_address_receiver VARCHAR(40), ' +
						'feedback VARCHAR(240), ' +
						'timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)'
	connection.query(sql, (error, results) => {
		if(error) {
			response.send({table_create_status: "Failed: " + error});
		}
		else {
			response.send({table_create_status: "Successful"});
		}
	})
	*/
	res.send("Created.");
});


router.get('/feedback/received', (req, res) => {
	/*
	var receiver = req.body.deviceaddress;
	
	// Join device_address sender and receiver on firstname/lastname
	var SQL = 'SELECT first_name, last_name, feedback, timestamp
	connection.query(SQL, (error, results) => {
		if (error) {
			response.send({feedback_received_status : 'Failed:' + error})
		}
		else {
			response.send({feedback_received_status : 'Successful',
							results : results});
		}
	}
	*/
	res.send("Received.");
});


router.get('/feedback/given', (req, res) => {
		/*
	var receiver = req.body.deviceaddress;
	
	// Join device_address sender and receiver on firstname/lastname
	var SQL = 'SELECT first_name, last_name, feedback, timestamp
	connection.query(SQL, (error, results) => {
		if (error) {
			response.send({feedback_received_status : 'Failed:' + error})
		}
		else {
			response.send({feedback_received_status : 'Successful',
							results : results});
		}
	}
	*/
	res.send("Given.");
});



module.exports = router;