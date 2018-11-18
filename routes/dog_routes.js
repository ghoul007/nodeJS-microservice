var Dog = require('../models/dog_model')

module.exports = function (app) {

    /**
     * Create
     */
    app.post('/dog', function (req, res) {
        var newDog = new Dog(req.body);
        newDog.save(function (err) {
            if (err) {
                res.json({ info: "error create dog" })
            }
            res.json({ info: 'dog created successful' });
        })
    })

    /**
     * List
     */
    app.get('/dogs', function (req, res) {
        Dog.find(function (err, data) {
            if (err) {
                res.json({ info: "error finding dogs" })
            }

                res.json({ info: 'dogs found successfly', dogs: data })
            // setTimeout(function () {
            //     res.json({ info: 'dogs found successfly', dogs: data })
            // }, 10000)

        })
    })

    /**
     * get by id
     */
    app.get('/dog/:id', function (req, res) {
        Dog.findById(req.params.id, function (err, dog) {
            if (err) {
                res.json({ info: "error finding dogs", err })
            }
            res.json({ info: 'dogs found successfly', dog })
        })


    })



    /**
     * update dog
     */
    app.put('/dog/:id', function (req, res) {
        Dog.findById(req.params.id, function (err, dog) {
            if (err) {
                res.json({ info: "error finding dogs", err })
            }
            if (dog) {
                Object.assign(dog, req.body);
                dog.save(function (err) {
                    if (err) {
                        res.json({ info: 'error during dog upfate' })
                    }
                    res.json({ info: 'dog updating succeefully' })
                })
            } else {
                res.json({ info: 'dog not found' })
            }
        })
    })


    /**
     * Delete dog
     */
    app.delete('/dog/:id', function (req, res) {
        Dog.findByIdAndRemove(req.params.id, function (err) {
            if (err) {
                res.json({ info: 'error during delet dog' })
            }
            res.json({ info: 'dog removed successfully' })
        })
    })



}