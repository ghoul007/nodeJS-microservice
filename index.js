var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.json())
var catCrud = require('./cat')(app)
// app.use(bodyParser.urlencoded({
    // extended: true
// }))

// app.get('/', function (req, res) {
//     // res.send('hello wolrd');
//     res.json({name: 'hello wolrd'});
// })

var server = app.listen(3000, function () {
    console.log('Server running at http://127.0.0.1:3000')
})