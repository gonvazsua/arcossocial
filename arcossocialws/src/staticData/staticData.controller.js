const express = require('express');
const router = express.Router();
const staticDataService = require('./staticData.service');

router.get('/', (req, res) => {
    staticDataService
        .findByName(req.query.name)
        .then(staticData => { res.jsonp(staticData) })
        .catch(err => {
            res.status(404);
            res.jsonp({'message' : 'Error obteniendo datos estáticos', 'reason' : err});
        });
});

module.exports = router;