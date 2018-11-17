module.exports = function (app) {


    _cats = [];

    /**
     * Create
     */
    app.post('/cat', function (req, res) {
        console.log(req.body);

        _cats.push(req.body);
        res.json({ info: 'cat created successful' });
    })

    /**
     * List
     */
    app.get('/cats', function (req, res) {
        res.json(_cats);
    })

    /**
     * get by id
     */
    app.get('/cat/:id', function (req, res) {
        res.json(_cats.find(obj => obj.id == +req.params.id));
    })



    /**
     * update cat
     */
    app.put('/cat/:id', function (req, res) {
        _cats = _cats.map(obj => {
            if (obj.id === +req.params.id) {
                return Object.assign({}, obj, req.body);
            }
            return obj;
        })
        res.json({ info: 'cat updated successfullty' });

    })


    /**
     * Delete cat
     */
    app.delete('/cat/:id', function (req, res) {
        _cats = _cats.filter(obj => obj.id !== +req.params.id);
        res.json({ info: "cat deleted successfullty" })
    })



}