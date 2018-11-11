// Dependencies
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var emotionalStatesController = require('./controllers/emotional_states')

// MongoDB
mongoose.connect('mongodb://localhost/rest_test');
mongoose.connect("mongodb://localhost:27017/rest_test", { useNewUrlParser: true });
mongoose.Promise = Promise;

// Express
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(__dirname +'/public'));
app.use(express.static(__dirname + '/views'));

// fire controllers
emotionalStatesController(app);

// Routes API
app.use('/api', require('./routes/api'));

// Start server
app.listen(3000);
console.log('API is running on port 3000');
