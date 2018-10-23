const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const fs = require ('fs');
const formdata = require ('form-data');
const multer = require('multer');
const port = process.env.PORT || 3000;
const app = express();

let upload  = multer({ storage: multer.memoryStorage() });

app.use(bodyParser.json());  //Read it in as JSON
app.use(bodyParser.urlencoded({extended: true}));

//creating connection object
var connection = mysql.createConnection({
  host     : process.env.RDS_HOSTNAME,
  user     : process.env.RDS_USERNAME,
  password : process.env.RDS_PASSWORD,
  port     : process.env.RDS_PORT,
  database : process.env.RDS_DBNAME,
  multipleStatements: true
});

var currentUsers = [];

/****************************************************************

FUNCTION:   GET: CREATE Table for database

ARGUMENTS:  Request on the API stream

RETURNS:    Returns a confirmation package

NOTES:      This query statements creates our user info table
            if one does not already exists within the DB.
            NOTE: Table schema represented here
****************************************************************/
app.get('/create_userinfotable', function(request,response) {
  try {
    connection.query( 'CREATE TABLE IF NOT EXISTS valkyriePrimaryDB.userinfotable(' +
    //table schema:
    ' first_name VARCHAR(15) not null,' +
    ' last_name VARCHAR(25) not null,' +
    ' device_address VARCHAR(40),' +
    ' availability BOOLEAN not null,' +
    ' team VARCHAR(25) not null,' +
    ' user_skill_package JSON,' +
    ' profile_picture LONGBLOB,' +
    ' PRIMARY KEY (device_address));', function (error, results, fields) {
      if(error) {
        response.send({table_create_status: "Failed: " + error});
      }
      else {
        response.send({table_create_status: "Successful"});
      }
    });
  } catch(e) {
    console.log("Invalid: " + e); //Print the error to console

    res.send({  //Send the error back to the app as JSON
      "confirmation" : "fail",
      "reason" : e
    });
  }
});

/****************************************************************

FUNCTION:   GET: DROP table from database

ARGUMENTS:  Request on the API stream

RETURNS:    Returns a confirmation package

NOTES:      This query statement drops a table from the data-
            base. This query is constantly being modified
            to keep up with database demands. Disabled
            until a specific table must be dropped
****************************************************************/
/*
app.get('/dropTable', function(request,response) {
  connection.query( 'DROP TABLE userinfotable', function (error, results, fields) {
    if(error) {
      response.send({table_drop_status: "Failed: " + error});
    }
    else {
      response.send({table_drop_status: "Successful"});
    }
  });
});
*/

/****************************************************************

FUNCTION:   GET: DROP column from table

ARGUMENTS:  Request on the API stream

RETURNS:    Returns a confirmation package

NOTES:      This query statement drops a new column from the
            table. This query is constantly being modified
            to keep up with database demands. Disabled
            until a specific column must be dropped
****************************************************************/
/*
app.get('/dropColumn', function(request,response) {
  connection.query( 'ALTER TABLE valkyriePrimaryDB.userinfotable DROP COLUMN [COLUMN NAME]', function (error, results, fields) {
    if(error) {
      response.send({column_drop_status: "Failed: " + error});
    }
    else {
      response.send({column_drop_status: "Successful"});
    }
  });
});
*/

/****************************************************************

FUNCTION:   GET: ADD column to table

ARGUMENTS:  Request on the API stream

RETURNS:    Returns a confirmation package

NOTES:      This query statement adds a new column to the
            table. This query is constantly being modified
            to keep up with database demands. Disabled
            until a specific column must be added
****************************************************************/
/*
app.get('/addColumn', function(request,response) {
  connection.query( 'ALTER TABLE valkyriePrimaryDB.userinfotable ADD COLUMN [COLUMMN NAME] [DATA DEFINITION] AFTER [COLUMN NAME]', function (error, results, fields) {
    if(error) {
      response.send({column_update_status: "Failed: " + error});
    }
    else {
      response.send({column_update_status: "Successful"});
    }
  });
});
*/

/****************************************************************

FUNCTION:   GET: MODIFY column in table

ARGUMENTS:  Request on the API stream

RETURNS:    Returns a confirmation package

NOTES:      This query statement modifies a column in the
            table. This query is constantly being modified
            to keep up with database demands. Disabled
            until a specific column must be modified
****************************************************************/
/*
app.get('/modifyColumn', function(request,response) {
  connection.query( "ALTER TABLE valkyriePrimaryDB.userinfotable CHANGE userSkillPackage user_skill_package;", function (error, results, fields) {
    if(error) {
      response.send({
        modify_column_status: "Failed: " + error
      });
    }
    else {
      response.send({
        modify_column_status: "Successful"
      });
    }
  });
});
*/

/****************************************************************

FUNCTION:   Get: Run manual command in database

ARGUMENTS:  Request on the API stream

RETURNS:    Returns a confirmation package

NOTES:      Allows someone to send a query statement through
            an intermediary, thereby manipulating the RDS
****************************************************************/
// WARNING: This opens the door for MySQL injection, MASSIVE SECURITY RISK
//          ALWAYS DISABLE WHEN NOT BEING USED.

app.get('/manual', function(req, res) {
  try{

    if(!checkData(req.headers.command)){    //Check if manual command is valid
      console.log("command = null");
      throw "command = null";               //If any error throw it
    }

    connection.query( req.headers.command + ";", function (error, results, fields) {
      if(error) {
        res.send({
          command_status: "Failed " + error //display error upon manual command failure
        });
      }
      else {
        res.send({
          command_status : "Successful!",  //display success confirmation + manual command results
          "Command" : req.headers.command,
          "results" : results
        });
      }
    });
  } catch(e) {
    console.log("Invalid: " + e); //Print the error

    res.send({  //Send the error back to the app as JSON
      "confirmation" : "fail",
      "reason" : e
    });
  }
});

/****************************************************************

FUNCTION:   GET: SELECT all from table

ARGUMENTS:  Request on the API stream

RETURNS:    Returns a confirmation package and results from
            SELECT query.

NOTES:      This query statement requests the entire table and
            returns the results back as a JSON package.
****************************************************************/
app.get('/selectAll', function(request, response) {
  try {
    connection.query( 'SELECT * FROM userinfotable;', function (error, results, fields) {
      if(error) {
        response.send({
          table_select_status: "Failed: " + error
        });
      }
      else {
        response.send({
          table_select_status: "Successful",
          "results" : results
        });
      }
    });
  } catch(e) {
    console.log("Invalid: " + e); //Print the error to console

    res.send({  //Send the error back to the app as JSON
      "confirmation" : "fail",
      "reason" : e
    });
  }
});

/****************************************************************

FUNCTION:   GET: SELECT data from /UserInfo/

ARGUMENTS:  Request on the API stream

RETURNS:    API-Returns confirmation code

NOTES:      Recives an API Get request, using device_address
            returns data associated with that device_address
****************************************************************/
app.get('/userInfo', function(req, res) {
  try{

    // WARNING: DO NOT CHANGE FORMAT OF 'deviceaddress'
    //          Using camel case will generate an error
    //          Data will NOT be written to server
    if(!checkData(req.headers.deviceaddress)){   //Check if device address is valid
      console.log("deviceaddress = null");
      throw "deviceaddress = null";              //If any error throw it
    }

    //SELECT query grabs data points associated with a given 'device_address'
    //packages the results into a JSON, sends this package to front end
    connection.query( "SELECT * FROM userinfotable where device_address = " + req.headers.deviceaddress + ";", function (error, results, fields) {
      if(error) {
        res.send({
          user_select_status: "Failed: " + error          //display error upon SELECT failure
        });
      }
      else {
        res.send({
          user_select_status : "Successful",              //display success confirmation + SELECT results
          "deviceaddress" : req.headers.deviceaddress,
          "results" : results                             //JSON package sent back here
        });
      }
    });
  } catch(e) {
    console.log("Invalid: " + e); //Print the error to console

    res.send({  //Send the error back to the app as JSON
      "confirmation" : "fail",
      "reason" : e
    });
  }
});

/****************************************************************

FUNCTION:   GET: Check in to local area

ARGUMENTS:  Request on the API stream

RETURNS:    API-Returns confirmation code

NOTES:      Recives an GET Post request, updates a persons
            availability in the physical space
****************************************************************/
app.get('/checkIn', function(req, res) {
  try{
    // WARNING: DO NOT CHANGE FORMAT OF 'deviceaddress'
    //          Using camel case will generate an error
    //          Data will NOT be written to server
    if(!checkData(req.headers.deviceaddress)){      //Check if device address is valid
      console.log("deviceaddress = null");
      throw "deviceaddress = null";                 //If any error throw it
    }

    //SELECT query grabs data points associated with a given 'device_address'
    connection.query( "SELECT * FROM userinfotable where device_address = " + req.headers.deviceaddress + ";", function (error, results, fields) {
      if(error) {
        res.send({
          checkin_status: "Check in failed"           //send error
        });
      }
      else if(results.length == 0)
      {
        res.send({
          checkin_status: "No device address in DB"   //send error
        });
      }

      else {
        for (var i=0; i<currentUsers.length; i++){                           //Look for deviceAddress in the array
          if (currentUsers[i].device_address == req.headers.deviceaddress){  //If the device is found
            res.send({
              user_select_status : "Successful",                             //display success confirmation + SELECT results
              "device_address" : req.headers.deviceaddress
            });
            return;
          }
        }

        currentUsers.push(results[0]);
        res.send({
          user_select_status : "Successful",                         //display success confirmation + SELECT results
          "device_address" : req.headers.deviceaddress
        });
      }
    });
  } catch(e) {
    res.send({  //Send the error back to the app as JSON
      "confirmation" : "Failed",
      "reason" : e
    });
  }
});


/****************************************************************

FUNCTION:   GET: Check out of local area

ARGUMENTS:  Request on the API stream

RETURNS:    API-Returns confirmation code

NOTES:      Recives an GET Post request, updates a persons
            availability in the physical space
****************************************************************/
app.get('/checkOut', function(req, res) {
  try{
    // WARNING: DO NOT CHANGE FORMAT OF 'deviceaddress'
    //          Using camel case will generate an error
    //          Data will NOT be written to server
    if(!checkData(req.headers.deviceaddress)){      //Check if device address is valid
      console.log("deviceaddress = null");
      throw "deviceaddress = null";                 //If any error throw it
    }

    for (var i=0; i<currentUsers.length; i++){  //Look for deviceAddress in the array
      if (currentUsers[i].device_address == req.headers.deviceaddress){  //If the device is found
        currentUsers.splice(i, 1);  //Delete it
      }
    }

    res.send({
      checkout_status : "Successful",
      "device_address" : req.headers.deviceaddress
    });
  }catch(e) {
    res.send({  //Send the error back to the app as JSON
      "confirmation" : "Failed",
      "reason" : e
    });
  }
});

/****************************************************************

FUNCTION:   GET: Query who is in immediate area

ARGUMENTS:  Request on the API stream

RETURNS:    API-Returns confirmation code

NOTES:      Recives an GET Post request, returns the array
            containing the users in proximity
****************************************************************/
app.get('/getCurrent', function(request, response) {
  try {
    response.send({
      get_current_status: "Successful",
      "results" : currentUsers
    });

  } catch(e) {
    console.log("Invalid: " + e); //Print the error to console

    res.send({  //Send the error back to the app as JSON
      "confirmation" : "fail",
      "reason" : e
    });
  }
});

/****************************************************************

FUNCTION:   POST: INSERT data from /firstTimeRegistration

ARGUMENTS:  Request on the API stream

RETURNS:    API-Returns confirmation code

NOTES:      Recives an API post request, checks the data to see
            if it is present, then add it to the DB.
****************************************************************/
app.post('/firstTimeRegistration', function(req, res) {
  try {

    // WARNING: DO NOT CHANGE FORMAT OF 'deviceaddress'
    //        Using camel case will generate an error
    //        Data will NOT be written to server
    if(!checkData(req.headers.deviceaddress)){  //Check if device address is valid
      console.log("deviceaddress = null");
      throw "deviceaddress = null";             //If any error, throw it
    }

    if(!checkData(req.body.firstName)){         //Check if the First Name is valid
      console.log("firstName = null");
      throw "firstName = null";
    }

    if(!checkData(req.body.lastName)){          //Check if the Last Name is valid
      console.log("lastName = null");
      throw "lastName = null";
    }

    if(!checkData(req.body.team)){              //Check if the team is valid
      console.log("bad_team");
      throw "team = null";
    }

    //INSERT query creates a new person in userinfotable
    connection.query( "INSERT INTO userinfotable (first_name, last_name, device_address, availability, team, user_skill_package) VALUES ('" +
    req.body.firstName + "', '" +
    req.body.lastName + "', '" +
    req.headers.deviceaddress + "', " +
    //availability defaults to false
    "false, " + "'" +
    req.body.team + "', " +
    //defaults to three empty strings
    'JSON_OBJECT( "skills", JSON_ARRAY ("", "", ""))' +
    //ON DUPLICATE KEY updates an existing users data based on the device_address
    ") ON DUPLICATE KEY UPDATE first_name = '" + req.body.firstName +
    "', last_name = '" + req.body.lastName +
    "', availability = false" +
    ", team = '" + req.body.team +
    "', " + 'user_skill_package = JSON_OBJECT( "skills", JSON_ARRAY ("", "", ""));' , function (error, results, fields) {
      if(error) {
        res.send({
          insert_status: "Failed: " + error //display error on INSERT failure
        });
      }
      else {
        res.send({
          insert_status : "Successful", //display success confirmation + INSERT results
          "deviceAddress" : req.headers.deviceaddress,
          "results" : results
        });
      }
    });
  } catch(e) {
    res.send({
      insert_status: "Insert failed: " + e //display error on server failure
    })
  }
});

/****************************************************************

FUNCTION:   POST: UPDATE team number from /updateTeamNumber/

ARGUMENTS:  Request on the API stream

RETURNS:    API-Returns confirmation code

NOTES:      Recives an API Post request, updates a persons
            team number
****************************************************************/
app.post('/updateTeam', function(req, res) {
  try{

    // WARNING: DO NOT CHANGE FORMAT OF 'deviceaddress'
    //          Using camel case will generate an error
    //          Data will NOT be written to server
    if(!checkData(req.headers.deviceaddress)){   //Check if device address is valid
      console.log("deviceaddress = null");
      throw "deviceaddress = null";              //If any error throw it
    }

    if(!checkData(req.body.team)){               //Check if team number is valid
      console.log("team = null");
      throw "team = null";                       //If any error throw it
    }

    //UPDATE query changes data points associated with a given 'device_address'
    //packages the results into a JSON array, sends this package to front end

    connection.query( "UPDATE valkyriePrimaryDB.userinfotable SET team = '" +
    req.body.team + "' WHERE device_address = " +
    req.headers.deviceaddress + ";", function (error, results, fields) {
      if(error) {
        res.send({
          team_update_status: "Failed: " + error //display error upon UPDATE failure
        });
      }
      else {
        res.send({
          team_update_status : "Successful", //display success confirmation + UPDATE results
          "deviceaddress" : req.headers.deviceaddress,
          "results" : results
        });
      }
    });
  } catch(e) {
    console.log("Invalid: " + e); //Print the error

    res.send({  //Send the error back to the app as JSON
      "confirmation" : "fail",
      "reason" : e
    });
  }
});

/****************************************************************

FUNCTION:   POST: UPDATE team number from /updateTeamNumber/

ARGUMENTS:  Request on the API stream

RETURNS:    API-Returns confirmation code

NOTES:      Recives an API Post request, updates a persons
            team number
****************************************************************/
app.post('/updateSkills', function(req, res) {
  try{

    // WARNING: DO NOT CHANGE FORMAT OF 'deviceaddress'
    //          Using camel case will generate an error
    //          Data will NOT be written to server
    if(!checkData(req.headers.deviceaddress)){  //Check if device address is valid
      console.log("deviceaddress = null");
      throw "deviceaddress = null";             //If any error throw it
    }

    if(!checkData(req.body.skills)){            //Check if package is valid
      console.log("skills = null");
      throw "skills = null";                    //If any error throw it
    }

    //UPDATE query changes data points associated with a given 'device_address'
    //packages the results into a JSON array, sends this package to front end

    connection.query( 'UPDATE userinfotable SET user_skill_package = JSON_OBJECT( "skills", JSON_ARRAY (' +
    req.body.skills + ") ) WHERE device_address = " +
    req.headers.deviceaddress + ";", function (error, results, fields) {
      if(error) {
        res.send({
          skill_update_status: "Failed: " + error //display error upon UPDATE failure
        });
      }
      else {
        res.send({
          skill_update_status : "Successful", //display success confirmation + UPDATE results
          "deviceaddress" : req.headers.deviceaddress,
          "results" : results
        });
      }
    });
  } catch(e) {
    console.log("Invalid: " + e); //Print the error

    res.send({  //Send the error back to the app as JSON
      "confirmation" : "fail",
      "reason" : e
    });
  }
});

/****************************************************************

FUNCTION:   POST: UPDATE profile picture from /updateprofilepic/

ARGUMENTS:  Request on the API stream

RETURNS:    API-Returns confirmation code

NOTES:      Recives an API Post request, updates a users
            profile picture
****************************************************************/
//upload() is a 'multer' object
app.post('/updateProfilePic', upload.single('image'), function(req, res) {
  try{

    // WARNING: DO NOT CHANGE FORMAT OF 'deviceaddress'
    //          Using camel case will generate an error
    //          Data will NOT be written to server
    if(!checkData(req.headers.deviceaddress)){      //Check if device address is valid
      console.log("deviceaddress = null");
      throw "deviceaddress = null";                 //If any error throw it
    }

    if(!checkData(req.file)){                       //Check if image is valid
      console.log("image = null");
      throw "image = null";                         //If any error throw it
    }

    //UPDATE query adds an image.png for a given 'device_address'
    //packages the results into a JSON array, sends this package to front end

    connection.query( "UPDATE userinfotable SET profile_picture = CAST ('" +
    req.file + "' AS BINARY) WHERE device_address = " +
    req.headers.deviceaddress + ";", function (error, results, fields) {
      if(error) {
        res.send({
          image_update_status: "Failed: " + error //display error upon UPDATE failure
        });
      }
      else {
        res.send({
          image_update_status : "Successful", //display success confirmation + UPDATE results
          "deviceaddress" : req.headers.deviceaddress,
          "image" : req.file,
          "results" : results
        });
      }
    });
  } catch(e) {
    console.log("Invalid: " + e); //Print the error

    res.send({  //Send the error back to the app as JSON
      "confirmation" : "fail",
      "deviceaddress" : req.headers.deviceaddress,
      "image" : req.file,
      "reason" : e
    });
  }
});

/****************************************************************

FUNCTION:   POST: UPDATE availability from /updateAvailability/

ARGUMENTS:  Request on the API stream

RETURNS:    API-Returns confirmation code

NOTES:      Recives an API Post request, updates a persons
            availability
****************************************************************/
app.post('/updateAvailability', function(req, res) {
  try{

    // WARNING: DO NOT CHANGE FORMAT OF 'deviceaddress'
    //          Using camel case will generate an error
    //          Data will NOT be written to server
    if(!checkData(req.headers.deviceaddress)){   //Check if device address is valid
      console.log("deviceaddress = null");
      throw "deviceaddress = null";              //If any error throw it
    }

    if(!checkData(req.body.availability)){       //Check if availability is valid
      console.log("availability = null");
      throw "availability = null";               //If any error throw it
    }

    //UPDATE query changes data points associated with a given 'device_address'
    //packages the results into a JSON array, sends this package to front end

    connection.query( "UPDATE valkyriePrimaryDB.userinfotable SET availability = " +
    req.body.availability + " WHERE device_address = " +
    req.headers.deviceaddress + ";", function (error, results, fields) {
      if(error) {
        res.send({
          availability_update_status: "Failed: " + error //display error upon UPDATE failure
        });
      }
      else {
        res.send({
          availability_update_status : "Successful", //display success confirmation + UPDATE results
          "deviceaddress" : req.headers.deviceaddress,
          "results" : results
        });
      }
    });
  } catch(e) {
    console.log("Invalid: " + e); //Print the error

    res.send({  //Send the error back to the app as JSON
      "confirmation" : "fail",
      "reason" : e
    });
  }
});

/****************************************************************

FUNCTION:   Verifies data is not NULL and valid

ARGUMENTS:  A single value from the API

RETURNS:    True if valid, False if Invalid

NOTES:      Checks the data that was recived from the API call
            to see if it is valid
****************************************************************/
function checkData(data) {
  if (data == null) //Check if data is null
  return false;
  /*
  //If the entered first or last name contains anything but letters, return false
  if ((data == req.body.firstName || data == req.body.lastName) && (!validator.isAlpha(req.body.firstName) || !validator.isAlpha(req.body.lastName)))
  return false;

  //If entered team number is not valid, return false
  if (!validator.isInt(req.body.teamNumber))
  return false;
  */

  return true;
}



app.listen(port);
module.exports = app;
