

var request = require('request').defaults({
    json: true
});


var async = require('async')
var redis = require('redis')
var config = require('config')
var portRedis = config.get("microservices.redis.port")
var urlRedis = config.get("microservices.redis.url")

var client = redis.createClient(portRedis, urlRedis)

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
                                    client.setex('http://localhost:3001/dogs', 20, JSON.stringify(body), function (error) {
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

    app.get('/status', function (req, res) {
        var promises = [];
        var services = config.get('microservices.services');
        services.forEach(element => {
            promises.push(
                new Promise((resolve, reject) => {
                    request(`http://${element.url}:${element.port}/ping`, (error, response, body) => {
                        if (!error && response.statusCode == 200) {
                            resolve(body)
                        } else {
                            resolve({
                                success: false,
                                address: element.url,
                                port: +element.port
                            })
                        }
                    })
                })
            )
        })

        result = []
        Promise.all(promises).then(
            (values) => {
                result.push(values)
            }
        ).catch((error) => {
           res.json(error)
        }).then(()=>{
            res.json(result);
        })
    });

}