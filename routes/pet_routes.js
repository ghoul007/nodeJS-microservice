var request = require('request').defaults({
    json: true
});


var async = require('async')
var redis = require('redis')

var client = redis.createClient(6379, '127.0.0.1')

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

                    client.get('http://localhost:3001/dogs', function (error, dog) {
                        if (error) { throw error }
                        if (dog) {
                            // res.json(JSON.parse(cat))
                            callback(null, JSON.parse(dog))
                        } else {
                            request({ uri: 'http://localhost:3001/dogs' }, function (error, response, body) {
                                if (error) {
                                    callback({ service: 'dog', error });
                                    return;
                                }
                                if (!error && response.statusCode === 200) {
                                    callback(null, body)
                                    client.setex('http://localhost:3001/dogs',20, JSON.stringify(body), function (error) {
                                        if (error) {
                                            throw error
                                        }
                                    })
                                } else {
                                    callback(response.statusCode)
                                }
                            })
                        }

                    })
                    // request({ uri: 'http://localhost:3001/dogs' }, function (error, response, body) {
                    //     if (error) {
                    //         callback({ service: 'dog', error });
                    //         return;
                    //     }

                    //     if (!error && response.statusCode === 200) {
                    //         callback(null, body)
                    //     } else {
                    //         callback(response.statusCode)
                    //     }
                    // })
                }


            },
            function (error, results) {
                // for (var x = 0; x < 1000000; x++) {
                //     console.log(x);
                // }
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