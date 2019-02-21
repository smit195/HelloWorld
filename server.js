const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const connection = require('./connection');
const bodyParser = require('body-parser');

app.use(bodyParser.json());  //Read it in as JSON
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static('public'));
app.use("/user", require("./routes/user"));
app.use("/feedback", require("./routes/feedback"));
//app.use("room", require("./routes/rooms"));

app.listen(port, () => {
	console.log("Listening on port " + port);
});

module.exports = app;
