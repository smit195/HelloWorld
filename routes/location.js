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





module.exports = router;
