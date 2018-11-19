

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
        res.send('1')
        async.parallel(
            {
                cat: function (callback) {
                    request({ uri: 'http://192.168.1.3:3001/cats' }, function (error, response, body) {
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

                    client.get('http://192.168.1.3:3002/dogs', function (error, dog) {
                        if (error) { throw error }
                        if (dog) {
                            // res.json(JSON.parse(cat))
                            callback(null, JSON.parse(dog))
                        } else {
                            request({ uri: 'http://192.168.1.3:3002/dogs' }, function (error, response, body) {
                                if (error) {
                                    callback({ service: 'dog', error });
                                    return;
                                }
                                if (!error && response.statusCode === 200) {
                                    callback(null, body)
                                    client.setex('http://192.168.1.3:3002/dogs', 20, JSON.stringify(body), function (error) {
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
                }


            },
            function (error, results) {
                // res.send('2')
                res.json({ error, results })
            }
        )
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
        }).then(() => {
            res.json(result);
        })
    });


    app.get('/dogs', (req, res) => {
        request('http://192.168.1.3:3002/dogs', (error, response, body) => {
            if (!error) {
                res.send(body);
            } else {
                res.send(error);
            }
        })
    })
    app.get('/cats', (req, res) => {
        request('http://192.168.1.3:3001/cats', (error, response, body) => {
            if (!error) {
                res.send(body);
            } else {
                res.send(error);
            }
        })
    })

}