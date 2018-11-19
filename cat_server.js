var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/cats')

app.use(bodyParser.json())
var catCrud = require('./routes/cat_routes')(app)


app.get('/ping', function(req,res){
    var status= {
        success: true,
        address: server.address().address,
        port: server.address().port
    }

    res.send(status)
})


var server = app.listen(3001, function () {
    console.log('Server running at http://127.0.0.1:3001')
})

