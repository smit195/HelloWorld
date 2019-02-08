const express = require('express');
const router = express.Router();
var connection = require('../connection');

// Creates the tables for the rooms
// NEEDS CORRECT SQL QUERIES
router.get('/room/createTable', (req, res) => {
	/*
	// room table that shows all rooms
	var sql = 'CREATE TABLE IF NOT EXISTS valkyriePrimaryDB.room(' +
						'feedbackID INT AUTO_INCREMENT, ' +
						'device_address_sender VARCHAR(40), ' +
						'device_address_receiver VARCHAR(40), ' +
						'feedback VARCHAR(240), ' +
						'timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)';
	connection.query(sql, (error, results) => {
		if(error) {
			response.status(500).send({table_create_status: "Failed: " + error});
			return;
		}
	})

	// roomUsers table that shows all users in the rooms
	sql = 'CREATE TABLE IF NOT EXISTS valkyriePrimaryDB.roomUsers(' +
						'feedbackID INT AUTO_INCREMENT, ' +
						'device_address_sender VARCHAR(40), ' +
						'device_address_receiver VARCHAR(40), ' +
						'feedback VARCHAR(240), ' +
						'timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)';
	connection.query(sql, (error, results) => {
		if (error) {
			response.status(500).send({table_create_status: "Failed: " + error});
			return;
		}
	});

	// Trigger that auto increments/decrements room table count
	sql = 'CREATE TRIGGER'
	connection.query(sql, (error, results) => {
		if (error) {
			response.status(500).send({table_create_status: "Failed: " + error});
			return;
		}
		else {
			response.status(200).send({table_create_status: "Successful"});
		}
	});
	*/
	res.send("Created.");
});



// Returns a list of all existing rooms
router.get('/room/list', (req, res) => {
	/*
	var roomID = '%';
	if (req.query.roomID) {
		var roomID = '%' + req.query.roomID + '%';
	}

	var SQL = 'SELECT * FROM valkyriePrimaryDB.room AS r' +
	 					'WHERE r.roomID LIKE ?;'
	connection.query(SQL, [roomID], err,results => {
		if (err) {
			res.status(200).send({room_list_status: 'Failed: ' + err;
		}
		else {
			res.status(200).send({room_list_status: 'Successful',
						results : results
			});
		}
	});

	*/
	res.send("List");
});

// Returns list of all users in one room
router.get('/room/users', (req, res) => {
	/*
	if (!req.query.roomID) {
		res.status(400).send({room_users_status: 'Failed: roomID parameter missing'};
		return;
	}
	var roomID = req.query.roomID;

	var SQL = 'SELECT * FROM valkyriePrimaryDB.roomUsers AS ru' +
						'WHERE ru.roomID = ?;';
	connection.query(SQL, [roomID], (err, results) => {
		if (err) {
			res.status(500).send({room_users_status: 'Failed: ' + err});
		}
		else {
			res.status(200).send({room_users_status: 'Successful',
				results : results
			});
		}
	});
	*/

	res.send("Users");
});

// Enters a user into a room
router.post('/room/join', (req, res) => {
	/*
	if (!req.body.roomID) {
		res.status(400).send({room_join_status : 'Failed: roomID parameter missing.'});
		return;
	}
	else if (!req.body.device_address) {
		res.status(400).send({room_join_status : 'Failed: device_address parameter missing.'});
		return;
	}

	var roomID = req.body.roomID;
	var device_address = req.body.device_address;

	var SQL = 'INSERT INTO valkyriePrimaryDB.roomUsers (roomID, device_address) ' +
						'VALUES (?, ?);";
	connection.query(SQL, [roomID, device_address], (err, results) => {
		if (err) {
			res.status(500).send({room_users_status: 'Failed: ' + err;
		}
		else {
			res.status(200).send({room_users_status: 'Successful',
						results : results
			});
		}
	});
	*/

	res.send("join");
});

// Have a user leave a room
router.post('/room/leave', (req, res) => {
	/*
	if (!req.body.roomID) {
		res.status(400).send({room_remove_status : 'Failed: roomID parameter missing.'});
		return;
	}
	else if (!req.body.device_address) {
		res.status(400).send({room_remove_status : 'Failed: device_address parameter missing.'});
		return;
	}

	var roomID = req.body.roomID;
	var device_address = req.body.device_address;

	var SQL = 'DELETE FROM valkyriePrimaryDB.roomUsers AS ru ' +
			      'WHERE ru.device_address = ?' +
			      'AND ru.roomID = ?';
	connection.query(SQL, [device_address, roomID], (err, results) => {
		if (err) {
			res.status(500).send({room_remove_status: 'Failed: ' + err;
		}
		else {
			res.status(200).send({room_remove_status: 'Successful'});
		}
	});
	*/

	res.send("leave");
});

module.exports = router;
