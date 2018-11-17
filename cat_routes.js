var Cat = require('./cat_model')

module.exports = function (app) {

    /**
     * Create
     */
    app.post('/cat', function (req, res) {
        var newCat = new Cat(req.body);
        newCat.save(function (err) {
            if (err) {
                res.json({ info: "error create cat" })
            }
            res.json({ info: 'cat created successful' });
        })
    })

    /**
     * List
     */
    app.get('/cats', function (req, res) {
        Cat.find(function (err, data) {
            if (err) {
                res.json({ info: "error finding cats" })
            }
            res.json({ info: 'cats found successfly', cats: data })
        })
    })

    /**
     * get by id
     */
    app.get('/cat/:id', function (req, res) {
        Cat.findById(req.params.id, function (err, cat) {
            if (err) {
                res.json({ info: "error finding cats", err })
            }
            res.json({ info: 'cats found successfly', cat })
        })


    })



    /**
     * update cat
     */
    app.put('/cat/:id', function (req, res) {
        Cat.findById(req.params.id, function (err, cat) {
            if (err) {
                res.json({ info: "error finding cats", err })
            }
            if (cat) {
                 Object.assign( cat, req.body);
                cat.save(function (err) {
                    if (err) {
                        res.json({ info: 'error during cat upfate' })
                    }
                    res.json({ info: 'cat updating succeefully' })
                })
            } else {
                res.json({ info: 'cat not found' })
            }
        })
    })


    /**
     * Delete cat
     */
    app.delete('/cat/:id', function (req, res) {
        Cat.findByIdAndRemove(req.params.id, function (err) {
            if (err) {
                res.json({ info: 'error during delet cat' })
            }
            res.json({ info: 'cat removed successfully' })
        })
    })



}