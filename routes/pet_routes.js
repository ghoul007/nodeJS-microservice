var request = require('request').defaults({
    json: true
});


var async = require('async')

module.exports = function (app) {



    app.get('/pets', function (req, res) {
        async.parallel(
            {
                cat: function (callback) {
                    request({ uri: 'http://localhost:3000/cats' }, function (error, response, body) {
                        if (error) {
                            callback({ service: 'cat', error });
                            return;
                        }
                        if (!error && response.statusCode === 200) {
                            callback(null, body)
                        } else {
                            callback(response.statusCode)
                        }
                    })
                },
                dog: function (callback) {
                    request({ uri: 'http://localhost:3001/dogs' }, function (error, response, body) {
                        if (error) {
                            callback({ service: 'dog', error });
                            return;
                        }

                        if (!error && response.statusCode === 200) {
                            callback(null, body)
                        } else {
                            callback(response.statusCode)
                        }
                    })
                }


            },
            function (error, results) {

                for (var x = 0; x < 1000000; x++) {
                    console.log(x);

                }

                res.json({ error, results })
            }
        )

        // request({ uri: 'http://localhost:3001/dogs' }, function (error, response, body) {
        //     if (!error && response.statusCode === 200) {
        //         res.json(body)
        //     } else {
        //         res.sendStatus(response.statusCode)
        //     }
        // })
    })

    app.get('/ping', function (req, res) {



        res.json({ ping: Date.now() });
    })

}