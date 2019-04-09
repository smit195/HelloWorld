const express = require("express");
var router = express.Router();
const connection = require("../connection");

router.post('/create_table', (req, res) => {
  let SQL = 'CREATE TABLE IF NOT EXISTS locationData()'
  connection.query(SQL, (error, results) => {
    if (error) {
      res.status(500).send({ message: "Failed: " + error })
    }
    else {
      res.status(200).send({ message: "Successful.", results: results });
    }
  })
})

// router.post('/insertLocation', (req, res) => {
// let device_address = req.body.device_address;
// let x_location = req.body.x_location;
// let y-location = req.body.y_location;
// if(!device_address || !x_location || !y_location){
// res.status(400).send({message : "Failed: device_address, x_location, y_location"})
// return;
// }

//let SQL = "INSERT INTO create_location_table (device_address, x_location, y_location) VALUES "
//
//



//
// connection.query(SQL, (error, results) => {
//   if(error) {
//     res.send({
//       message: "Failed: " + error
//     });
//   }
//   else {
//     updateArray(device_address);
//     res.send({
//       message: "Successful",
//       device_address: device_address,
//       results: results
//     });
//   }
// });
//});


module.exports = router;
