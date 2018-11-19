var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var config = require('config')
var url = config.get('microservices.host');
var port = config.get('microservices.port');

app.use(bodyParser.json())
var catCrud = require('./routes/pet_routes')(app)
var server = app.listen(port, function () {
    console.log(`Server running at ${url}:${port}`)
})