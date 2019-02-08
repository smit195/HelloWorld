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
			response.send({table_create_status: "Failed: " + error});
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
			response.send({table_create_status: "Failed: " + error});
			return;
		}
	});
	
	// Trigger that auto increments/decrements room table count
	sql = 'CREATE TRIGGER'
	connection.query(sql, (error, results) => {
		if (error) {
			response.send({table_create_status: "Failed: " + error});
			return;
		}
		else {
			response.send({table_create_status: "Successful"});
		}
	});
	*/
	res.send("Created.");
});



// Returns a list of all existing rooms
router.get('/room/list', (req, res) => {
	/*
	var sql = 'SELECT * FROM valkyriePrimaryDB.room;'
	connection.query(sql, (err, results) => {
		if (err) {
			res.send({room_list_status: 'Failed: ' + err;
		}
		else {
			res.send({room_list_status: 'Successful',
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
		res.send({room_users_status: 'Failed: roomID parameter missing'};
		return;
	}
	var roomID = req.query.roomID;
	
	var sql = 'SELECT * FROM valkyriePrimaryDB.roomUsers AS ru' +
				'WHERE ru.roomID = ' + connection.escape(roomID) + ';';
	connection.query(sql, (err, results) => {
		if (err) {
			res.send({room_users_status: 'Failed: ' + err;
		}
		else {
			res.send({room_users_status: 'Successful',
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
		res.send({room_join_status : 'Failed: roomID parameter missing.'});
		return;
	}
	else if (!req.body.device_address) {
		res.send({room_join_status : 'Failed: device_address parameter missing.'});
		return;
	}
	
	var roomID = req.body.roomID;
	var device_address = req.body.device_address;
	
	var sql = 'INSERT INTO valkyriePrimaryDB.roomUsers (roomID, device_address) ' +
				'VALUES (' + connection.escape(roomID) + ', ' +
				connection.escape(device_address) + ");";
				
	connection.query(sql, (err, results) => {
		if (err) {
			res.send({room_users_status: 'Failed: ' + err;
		}
		else {
			res.send({room_users_status: 'Successful',
						results : results
			});
		}
	});
	*/
	
	res.send("join");
});

// Remove a user from a room
router.post('/room/remove', (req, res) => {
	/*
	if (!req.body.roomID) {
		res.send({room_remove_status : 'Failed: roomID parameter missing.'});
		return;
	}
	else if (!req.body.device_address) {
		res.send({room_remove_status : 'Failed: device_address parameter missing.'});
		return;
	}
	
	var roomID = req.body.roomID;
	var device_address = req.body.device_address;
	
	var sql = 'DELETE FROM valkyriePrimaryDB.roomUsers AS ru ' +
			  'WHERE ru.device_address = ' + connection.escape(device_address) + ' ' +
			  'AND ru.roomID = ' + connection.escape(roomID) + ';';
				
	connection.query(sql, (err, results) => {
		if (err) {
			res.send({room_remove_status: 'Failed: ' + err;
		}
		else {
			res.send({room_remove_status: 'Successful'});
		}
	});
	*/
	
	res.send("remove");
});

module.exports = router;