var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/cats')

app.use(bodyParser.json())
var catCrud = require('./cat_routes')(app)

var server = app.listen(3000, function () {
    console.log('Server running at http://127.0.0.1:3000')
})