const express = require('express');
const router = express.Router();
var connection = require('../connection');
const fs = require ('fs');
const formdata = require ('form-data');
const multer = require('multer');
const schedule = require('node-schedule');
var base64ArrayBuffer = require("base64-arraybuffer");

let upload  = multer({ storage: multer.memoryStorage() });
//var upload = multer().single('image')

var currentUsers = [];

/****************************************************************

FUNCTION:   GET: CREATE Table for database

ARGUMENTS:  Request on the API stream

RETURNS:    Returns a confirmation package

NOTES:      This query statements creates our user info table
            if one does not already exists within the DB.
            NOTE: Table schema represented here
****************************************************************/
router.get('/create_userinfotable', (req, res) => {
  let SQL = 'CREATE TABLE IF NOT EXISTS valkyriePrimaryDB.userinfotable( ' +
            //table schema:
            'first_name VARCHAR(15) NOT NULL, ' +
            'last_name VARCHAR(25) NOT NULL, ' +
            'device_address VARCHAR(40), ' +
            'availability BOOLEAN NOT NULL, ' +
            'team VARCHAR(25) NOT NULL, ' +
            'profile_picture LONGBLOB, ' +
            'PRIMARY KEY (device_address));'
  connection.query(SQL, (error, results) => {
    if(error) {
      res.send({ message: "Failed: " + error });
    }
    else {
      res.send({ message: "Successful" });
    }
  });
});

/***********************************************************
* FUNCTION: Create the skills table if it doesn't exist
*
************************************************************/

router.get('/create_skills_table', (req, res) => {
  let SQL = 'CREATE TABLE IF NOT EXISTS valkyriePrimaryDB.skills( ' +
            'skill_ID INT AUTO_INCREMENT, ' +
            'device_address VARCHAR(40) NOT NULL, ' +
            'skill VARCHAR(20) NOT NULL, ' +
            'skill_level VARCHAR(1) DEFAULT 0, ' +
            'PRIMARY KEY (skill_ID), ' +
            'FOREIGN KEY (device_address) REFERENCES valkyriePrimaryDB.userinfotable(device_address));';
  connection.query(SQL, (error, results) => {
    if (error) {
      res.send({ message: "Failed: " + error });
    }
    else {
      res.send({ message: "Successful." });
    }
  });
});

/****************************************************************
 FUNCTION:   GET: CREATE Table for database

 ARGUMENTS:  Request on the API stream

 RETURNS:    Returns a confirmation package

 NOTES:      This query statements creates our user alert table
            if one does not already exists within the DB.
            NOTE: Table schema represented here
****************************************************************/
router.get('/create_useralerttable', (req, res) => {
  let SQL = 'CREATE TABLE IF NOT EXISTS valkyriePrimaryDB.useralerttable( ' +
            'device_address_sender VARCHAR(40), ' +
            'device_address_receiver VARCHAR(40), ' +
            'time_of_request TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, ' +
            'PRIMARY KEY (device_address_sender, device_address_receiver));'
  connection.query(SQL, (error, results) => {
    if(error) {
      res.send({message: "Failed: " + error});
    }
    else {
      res.send({message: "Successful"});
    }
  });
});

/****************************************************************

 FUNCTION:   GET: CREATE Table for database

 ARGUMENTS:  Request on the API stream

 RETURNS:    Returns a confirmation package

 NOTES:      This query statements creates our user picture table
            if one does not already exists within the DB.
            NOTE: Table schema represented here
****************************************************************/
router.get('/create_userpicturetable', (req,res) => {
  let SQL = 'CREATE TABLE IF NOT EXISTS valkyriePrimaryDB.userpicturetable( ' +
            'device_address VARCHAR(40), ' +
            'profile_picture LONGBLOB, ' +
            'PRIMARY KEY (device_address));'
  connection.query(SQL, function (error, results) {
    if(error) {
       res.status(500).send({message: "Failed: " + error});
     }
     else {
       res.status(200).send({message: "Successful", results: results});
     }
  });
});

/****************************************************************

FUNCTION:   GET: SELECT all from userinfotable

ARGUMENTS:  Request on the API stream

RETURNS:    Returns a confirmation package and results from
            SELECT query.

NOTES:      This query statement requests the entire table and
            returns the results back as a JSON package.
****************************************************************/
router.get('/selectAll', (req, res) => {
  let SQL = 'SELECT * FROM userinfotable';
  connection.query(SQL, (error, results) => {
    if (error) {
      res.status(500).send({ message: "Failed: " + error });
    }
    else {
      res.status(200).send({ message: "Successful", results: results });
    }
  });
});

/****************************************************************

FUNCTION:   GET: SELECT data from /UserInfo/

ARGUMENTS:  Request on the API stream

RETURNS:    API-Returns confirmation code

NOTES:      Recives an API Get request, using device_address
            returns data associated with that device_address
****************************************************************/
router.get('/userInfo', function(req, res) {
  let device_address = req.query.device_address;
  if(!device_address) {   //Check if device address is valid
    res.status(400).send({ message: "Failed: Missing device_address parameter." });
    return;
  }

  //SELECT query grabs data points associated with a given 'device_address'
  //packages the results into a JSON, sends this package to front end
  let SQL = "SELECT userinfotable.*, userpicturetable.profile_picture FROM userinfotable LEFT JOIN userpicturetable ON userinfotable.device_address=userpicturetable.device_address WHERE userinfotable.device_address = ?;"
  connection.query( SQL, [device_address], (error, results) => {
    if(error) {
      res.status(500).send({ message: "Failed: " + error });
    }
    else {
      res.status(200).send({ message : "Successful", device_address : device_address, results : results });
    }
  });
});

/****************************************************************

FUNCTION:   GET: SELECT data from /pictureInfo/

ARGUMENTS:  Request on the API stream

RETURNS:    API-Returns confirmation code

NOTES:      Recives an API Get request, using deviceaddress
            returns picture associated with that deviceaddress

            res.json({
              picture_select_status : "Successful",              //display success confirmation + SELECT results
              "deviceaddress" : req.headers.deviceaddress,
              "results" : imageBuffer                             //JSON package sent back here
            });
****************************************************************/
router.get('/pictureInfo', function(req, res) {
  let device_address = req.query.device_address;
  if(!device_address) {
    res.status(400).send({ message: "Failed: Missing device_address parameter." })
    return;
  }

  //SELECT query grabs data points associated with a given 'device_address'
  //packages the results into a JSON, sends this package to front end
  let SQL = "SELECT * FROM userpicturetable where device_address = ?;"
  connection.query(SQL, [device_address], (error, results) => {
    if(error) {
      res.status(500).send({ message: "Failed: " + error });
    }
    else {
      res.status(200).send({ message: "Successful", results: results });
    }
  });
});

/****************************************************************

FUNCTION:   GET: Check in to local area

ARGUMENTS:  Request on the API stream

RETURNS:    API-Returns confirmation code

NOTES:      Recives an GET Post request, updates a persons
            availability in the physical space
****************************************************************/
router.get('/checkIn', (req, res) => {
  let device_address = req.query.device_address;
  if(!device_address) {
    res.status(400).send({ message: 'Failed: Missing device_address parameter' })
    return;
  }

  //SELECT query grabs data points associated with a given 'device_address'
  let SQL = "SELECT userinfotable.*, userpicturetable.profile_picture FROM userinfotable LEFT JOIN userpicturetable ON userinfotable.device_address=userpicturetable.device_address WHERE userinfotable.device_address = ?;"
  connection.query(SQL, [device_address], (error, results) => {
    if(error) {
      res.status(500).send({ message: "Failed" + error });
    }
    else if(results.length == 0) {
      res.status(404).send({ message: "Failed: Unknown device_address" });
    }
    else {
      updateArray(device_address);
      currentUsers.sort(compare);

      res.send({ message: "Successful", device_address: device_address })
    }
  });
});

/****************************************************************

FUNCTION:   GET: Check out of local area

ARGUMENTS:  Request on the API stream

RETURNS:    API-Returns confirmation code

NOTES:      Recives an GET Post request, updates a persons
            availability in the physical space
****************************************************************/
router.get('/checkOut', (req, res) => {
  let device_address = req.query.device_address;
  if(!device_address) {
    res.status(400).send({ message: "Failed: Missing device_address parameter" })
    return;
  }

  // Find user in table, delete
  for (var i=0; i<currentUsers.length; i++) {
    if (currentUsers[i].device_address == device_address){
      currentUsers.splice(i, 1);
    }
  }

  res.status(200).send({ message: "Successful", device_address: device_address });
});

/****************************************************************

FUNCTION:   GET: Query who is in immediate area

ARGUMENTS:  Request on the API stream

RETURNS:    API-Returns confirmation code

NOTES:      Recives an GET Post request, returns the array
            containing the users in proximity
****************************************************************/
router.get('/getCurrent', (req, res)  => {
  let device_address = req.query.device_address;
  if(!device_address){
    res.status(400).send({ message: "Failed: Missing device_address parameter." });
    return;
  }

  var AlertCount = -1;

  //Get the current number of alerts for deviceaddrress
  let SQL = "SELECT COUNT(*) AS Count from useralerttable WHERE device_address_receiver = ?;"
  connection.query(SQL, [device_address], (error, results, fields) => {
    if (error) {
      AlertCount = "Failed: " + error //display error upon UPDATE failure
    }
    else {
      tempResults = JSON.parse(JSON.stringify( results[0] )); //Parse the results and save the total number
      AlertCount = tempResults.Count;
    }

    var TEMPcurrentUsers = JSON.parse(JSON.stringify( currentUsers ));  //Temp current user array

    for (var i=0; i<TEMPcurrentUsers.length; i++){  //Look for deviceAddress in the array
      if (TEMPcurrentUsers[i].device_address == device_address){  //If the device is found
        TEMPcurrentUsers.splice(i, 1);  //Delete it
      }
    }

    res.send({
      message: "Successful",
      results: TEMPcurrentUsers,
      alertCount: AlertCount
    });
  });
});


router.get('/getCurrent22', (req, res) => {
    var TEMPcurrentUsers = JSON.parse(JSON.stringify( currentUsers ));  //Temp current user array

    for (var i=0; i<TEMPcurrentUsers.length; i++){  //Look for deviceAddress in the array
      if(TEMPcurrentUsers[i].profile_picture != null) {
        var imageBase64 = base64ArrayBuffer.encode(TEMPcurrentUsers[i].profile_picture)
        var imageUri = "data:image/png;base64," + imageBase64;
        TEMPcurrentUsers[i].profile_picture = imageUri;
      }
    }

    res.send({
      message: "Successful",
      results: TEMPcurrentUsers
    });
});

/****************************************************************

FUNCTION:   GET: Query that returns current alers

ARGUMENTS:  Request on the API stream

RETURNS:    API-Returns confirmation code

NOTES:      Recives a GET request and returns all of the current
            alerts for the UUID.
****************************************************************/
router.get('/checkAlert', (req, res) => {
  let device_address = req.query.device_address
  if(!device_address){
    res.status(400).send({ message: "Failed: Missing device_address parameter."})
    return;
  }

  let SQL = "SELECT userinfotable.first_name, userinfotable.last_name, userinfotable.device_address, userinfotable.team, useralerttable.time_of_request, CONVERT_TZ(useralerttable.time_of_request,'GMT','-6:00') AS time_of_request, userpicturetable.profile_picture " +
            "FROM useralerttable, userinfotable " +
            "LEFT JOIN userpicturetable " +
            "ON userinfotable.device_address=userpicturetable.device_address " +
            "WHERE useralerttable.device_address_sender = userinfotable.device_address " +
            "AND useralerttable.device_address_receiver = ?;"
  connection.query(SQL, [device_address], (error, results) => {
    if (error) {
      res.status(500).send({ message: "Failed: " + error });
    }
    else {
      res.status(200).send({
        message: "Successful",
        device_address: device_address,
        results: results
      });
    }
  });
});

/****************************************************************

FUNCTION:   POST: INSERT data from /firstTimeRegistration

ARGUMENTS:  Request on the API stream

RETURNS:    API-Returns confirmation code

NOTES:      Recives an API post request, checks the data to see
            if it is present, then add it to the DB.
****************************************************************/
router.post('/firstTimeRegistration', (req, res) => {
  let device_address = req.body.device_address;
  let first_name = req.body.first_name;
  let last_name = req.body.last_name;
  let team = req.body.team;
  if(!device_address || !first_name || !last_name || !team){  //Check if device address is valid
    res.status(400).send({ message: "Failed: device_address, first_name, last_name, and team parameters required."})
    return;
  }

  //INSERT query creates a new person in userinfotable
  let SQL = "INSERT INTO userinfotable (first_name, last_name, device_address, availability, team, user_skill_package) VALUES ('" +
            first_name + "', '" +
            last_name + "', '" +
            device_address + "', " +
            //WARNING: availability defaults to TRUE
            //despite the fact that the next line says "false"
            "false, " + "'" +
            team + "', " +
            //defaults to three empty strings
            'JSON_OBJECT( "skills", JSON_ARRAY ("", "", ""))' +
            //ON DUPLICATE KEY updates an existing users data based on the device_address
            ") ON DUPLICATE KEY UPDATE first_name = '" + first_name +
            "', last_name = '" + last_name +
            //WARNING: availability defaults to TRUE
            //despite the fact that the next line says "false"
            "', availability = false" +
            ", team = '" + team +
            "', " + 'user_skill_package = JSON_OBJECT( "skills", JSON_ARRAY ("", "", ""));'
  connection.query(SQL, (error, results) => {
    if(error) {
      res.send({
        message: "Failed: " + error
      });
    }
    else {
      updateArray(req.headers.deviceaddress);
      res.send({
        message: "Successful",
        device_address: device_address,
        results: results
      });
    }
  });
});

/****************************************************************

FUNCTION:   POST: UPDATE team number from /updateTeamNumber/

ARGUMENTS:  Request on the API stream

RETURNS:    API-Returns confirmation code

NOTES:      Recives an API Post request, updates a persons
            team number
****************************************************************/
router.post('/updateTeam', (req, res) => {
  let device_address = req.body.device_address;
  let team = req.body.team;
  if(!device_address || !team){   //Check if device address is valid
    res.status(400).send({ message: "Failed: device_address and team parameters ." });
    return;
  }

  //UPDATE query changes data points associated with a given 'device_address'
  //packages the results into a JSON array, sends this package to front end
	let SQL = "UPDATE valkyriePrimaryDB.userinfotable SET team = ? " +
						"WHERE device_address = ?;"
  connection.query( SQL, [team, device_address], (error, results) => {
    if(error) {
      res.status(500).send({ message: "Failed: " + error });
    }
    else {
      updateArray(device_address);
      res.status(200).send({ message: "Successful", device_address: device_address, results: results });
    }
  });
});

/****************************************************************

FUNCTION:   POST: UPDATE skills from /updateTeamNumber/

ARGUMENTS:  Request on the API stream

RETURNS:    API-Returns confirmation code

NOTES:      Recives an API Post request, updates a persons
            team number
****************************************************************/
router.post('/updateSkill', (req, res) => {
  var device_address = req.body.device_address;
  var skills;
  if (!device_address) {
    res.status(400).send({ message: "Failed: Missing device_address" })
    return;
  }
  try {
    skills = Array.from(req.body.skills);
  }
  catch (ಠ_ಠ) {
    console.log(ಠ_ಠ);
    res.status(400).send({ message: "Failed: Missing skills array" })
    return;
  }

  //UPDATE query
  var SQL;
  for (var i = 0; i < skills.length; i++) {
    console.log("skills: " + skills[i][0] + " " + skills[i][1] + " " + skills[i][2])
    SQL += 'UPDATE skills ' +
           'SET skill = ' + connection.escape(skills[i][2]) + ', ' +
           'skill_level = ' + connection.escape(skills[i][1]) + " " +
           'WHERE skill_ID = ' + connection.escape(skills[i][0]) + '; ';
  }

  connection.query( SQL, (error, results) => {
    if(error) {
			res.status(500).send({ message: "Failed: " + error });
    }
    else {
      updateArray(device_address);
      res.status(200).send({ message: "Successful", results: results });
    }
  });
});

router.post('/insertSkill', (req, res) => {
  var values;
  try {
    values = Array.from(req.body.userSkills);
  }
  catch (e) {
    res.status(400).send({ message: "Failed: Missing values array" })
  }

  //UPDATE query
	let SQL = "INSERT INTO skills (device_address, skill, skill_level) " +
            "VALUES ?;"
  connection.query( SQL, [values], (error, results) => {
    if(error) {
			res.status(500).send({ message: "Failed: " + error });
    }
    else {
      updateArray(device_address);
      res.status(200).send({ message: "Successful", results: results });
    }
  });
});

router.post('/deleteSkill', (req, res) => {
  let skill_ID = req.body.skill_ID;
  let device_address = req.body.device_address;
  if (!skill_ID || !req.body.device_address) {
    res.status(400).send({ message: "Failed: skill_ID is a required parameter."})
    return;
  }

  let SQL = "DELETE FROM skills WHERE skill_ID = ? AND device_address = ?";
  connection.query( SQL, [skill_ID, device_address], (error, results) => {
    if (error) {
      res.status(500).send({ message: "Failed: " + error });
    }
    else {
      updateArray(device_address);
      res.status(200).send({ message: "Successful", results: results });
    }
  })
})

router.post('/deleteAllSkills', (req, res) => {
  let device_address = req.body.device_address;
  if (!device_address) {
    res.status(400).send({ message: "Failed: device_address is a required parameter."})
    return;
  }

  let SQL = "DELETE FROM skills WHERE device_address = ?";
  connection.query( SQL, [device_address], (error, results) => {
    if (error) {
      res.status(500).send({ message: "Failed: " + error });
    }
    else {
      updateArray(device_address);
      res.status(200).send({ message: "Successful", results: results });
    }
  })
})

router.get('/getSkills', (req, res) => {
  let device_address = req.query.device_address;
  if (!device_address) {
    res.status(400).send({ message: "Failed: device_address required."})
    return;
  }

  let SQL = "SELECT skill_ID, skill, skill_level FROM skills " +
            "WHERE device_address = ?;";
  connection.query( SQL, [device_address], (error, results) => {
    if (error) {
      res.status(500).send({ message: "Failed: " + error })
      return;
    }
    res.status(200).send({ message: "Successful", results: results })
  })
})

/****************************************************************

FUNCTION:   POST: INSERT profile picture from /updateprofilepic/

ARGUMENTS:  Request on the API stream

RETURNS:    API-Returns confirmation code

NOTES:      Recives an API Post request, updates a users
            profile picture
****************************************************************/
router.post('/updateProfilePic', upload.single('image'), (req, res) => {
	let device_address = req.body.device_address;
	let file = req.file;
  if(!device_address) {
    res.status(400).send({ message: "Failed: Missing device_address parameter" });
    return;
  }
  if(!file) {
    res.status(400).send({ message: "Failed: Missing image file parameter" });
  }

  var imageBuffer = Buffer.from(req.file.buffer)

  var SQL = "INSERT INTO userpicturetable SET profile_picture = ? , device_address = ? " +
						"ON DUPLICATE KEY UPDATE profile_picture = ?;"
  connection.query(SQL, [imageBuffer, device_address, imageBuffer], (error, results) => {
    if(error) {
      res.status(400).send({ message: "Failed: " + error });
    }
    else {
      ray(device_address);
      res.status(200).send({ message: "Successful", device_address: device_address, results: results });
    }
  });
});

/****************************************************************

FUNCTION:   POST: UPDATE availability from /updateAvailability/

ARGUMENTS:  Request on the API stream

RETURNS:    API-Returns confirmation code

NOTES:      Recives an API Post request, updates a persons
            availability
****************************************************************/
router.post('/updateAvailability', (req, res) => {
	let device_address = req.body.device_address;
	let availability = req.body.availability;
  if(!device_address || typeof(availability) === 'undefined') {
    res.status(400).send({ message: "Failed: device_address and availability parameters required." });
    return;
  }

  //UPDATE query changes data points associated with a given 'device_address'
  //packages the results into a JSON array, sends this package to front end
	let SQL = "UPDATE valkyriePrimaryDB.userinfotable SET availability = ? WHERE device_address = ?;"
  connection.query( SQL, [availability, device_address], (error, results) => {
    if(error) {
      res.status(500).send({ message: "Failed: " + error });
    }
    else {
      updateArray(device_address);
      res.status(200).send({ message: "Successful", device_address: device_address, results: results });
    }
  });
});

/****************************************************************

FUNCTION:   POST: Creates a new Alert

ARGUMENTS:  Request on the API stream

RETURNS:    API-Returns confirmation code

NOTES:      Makes a new alert for a user using yours and their
            UUID. It also sets the current time.
****************************************************************/
router.post('/sendAlert', (req, res) => {
	let device_address = req.body.device_address;
	let device_address_receiver = req.body.device_address_receiver;
  if(!device_address || !device_address_receiver) {
		res.status(400).send({ message: "Failed: device_address and device_address_receiver parameters" });
    return;
  }

	let SQL = "INSERT INTO valkyriePrimaryDB.useralerttable (device_address_sender, device_address_receiver)  VALUES(?, ?);"
  connection.query( SQL, [device_address, device_address_receiver], (error, results) => {
    if(error) {
      res.status(500).send({ status: 500, message: "Failed: " + error });
    }
    else {
      res.status(200).send({ status: 200, message: "Successful", device_address: device_address, results: results });
    }
  });
});

/****************************************************************

FUNCTION:   POST: Deletes an Alert

ARGUMENTS:  Request on the API stream

RETURNS:    API-Returns confirmation code

NOTES:      Makes a new alert for a user using yours and their
            UUID. It also sets the current time.
****************************************************************/
router.post('/deleteAlert', (req, res) => {
	let device_address = req.body.device_address;
	let device_address_sender = req.body.device_address_sender;
  if(!device_address || !device_address_sender) {
		res.status(400).send({ message: "Failed: device_address and device_address_sender parameters required." });
    return;
	}

	let SQL = "DELETE FROM valkyriePrimaryDB.useralerttable WHERE device_address_receiver like ? AND device_address_sender like ?;"
  connection.query(SQL, [device_address, device_address_sender], (error, results) => {
    if(error) {
      res.status(500).send({ message: "Failed: " + error });
    }
    else {
      res.status(200).send({ message: "Successful", device_address: device_address, results: results });
    }
  });
});

/****************************************************************

FUNCTION:   POST: Deletes All Alert

ARGUMENTS:  Request on the API stream

RETURNS:    API-Returns confirmation code

NOTES:      Makes a new alert for a user using yours and their
            UUID. It also sets the current time.
****************************************************************/
router.post('/deleteAllAlert', (req, res) => {
	let device_address = req.body.device_address;
  if(!device_address) {   //Check if device address is valid
    res.status(400).send({ message: "Failed: Missing device_address parameter." });
  }

	let SQL = "DELETE FROM valkyriePrimaryDB.useralerttable WHERE device_address_receiver like ?;"
  connection.query(SQL, [device_address], (error, results) => {
    if(error) {
      res.status(500).send({ message: "Failed: " + error });
    }
    else {
      res.status(200).send({ message: "Successful", device_address: device_address, results: results });
    }
  });
});

/****************************************************************

FUNCTION:   Delete any extra users in the array

ARGUMENTS:  None

RETURNS:    None

NOTES:      If there are any extra users left in the array,
            clear then at midnight.
****************************************************************/
schedule.scheduleJob('0 0 * * *', () => {
  currentUsers = [];
}) // run everyday at midnight

/****************************************************************

FUNCTION:   Checks and updates the info in the array after a POST

ARGUMENTS:  The deviceAddress

RETURNS:    None

NOTES:      If any of the data in the database is changed,
            reload the new data into the currentUsers array.
****************************************************************/
function updateArray(id) {
  var userinfo;
  var skills;

  // Grab user info and skills
  let SQL = "SELECT userinfotable.*, userpicturetable.profile_picture FROM userinfotable LEFT JOIN userpicturetable ON userinfotable.device_address=userpicturetable.device_address WHERE userinfotable.device_address = ?;"
  connection.query( SQL, [id], (error, results) => {
    if (error) return false;
    userinfo = results[0];

    SQL = "SELECT skill, skill_level, skill_ID FROM skills WHERE device_address = ?;"
    connection.query(SQL, [id], (error, results) => {
      if (error) return false;
      userinfo["skills"] = results;

      // Update entry in currentUsers array
      for (let i = 0;  i < currentUsers.length; i++) {
        if (currentUsers[i].device_address == id) {
          currentUsers.splice(i, 1);  // Delete it
                                      // and reload it
          currentUsers.push(userinfo);
          // currentUsers[i]["skills"] = skills;

          currentUsers.sort(compare);
          return true;
        }
      }

      // Create new entry in currentUsers array
      currentUsers.push(userinfo);
      currentUsers.sort(compare);
      return true;
    });
  });
}

function compare(a, b) {
  if (a.availability < b.availability) {
    return -1;
  } else if (a.availability > b.availability) {
    return 1;
  } else if (a.availability == b.availability) {
    return 0;
  }
}

/****************************************************************

FUNCTION:   Get: Run manual command in database

ARGUMENTS:  Request on the API stream

RETURNS:    Returns a confirmation package

NOTES:      Allows someone to send a query statement through
            an intermediary, thereby manipulating the RDS
****************************************************************/
// WARNING: This opens the door for MySQL injection, MASSIVE SECURITY RISK
//          ALWAYS DISABLE WHEN NOT BEING USED.

router.post('/manual', (req, res) => {
  let SQL = req.body.SQL;
  if (!SQL) {
    res.status(500).send({ message: "Failed: SQL required."})
  }
  connection.query(SQL, (err, results) => {
    if (err) {
      res.status(500).send({auth: false, message: "Internal server error: " + err})
      return;
    }
    res.status(200).send({results: results});
  });
});

module.exports = router;
