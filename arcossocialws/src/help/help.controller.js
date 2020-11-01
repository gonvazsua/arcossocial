const express = require('express');
const router = express.Router();
const helpService = require('./help.service');

router.get('/', (req, res) => {
    helpService
        .findHelps(req.query)
        .then(helps => { res.jsonp(helps) })
        .catch(err => {
            res.status(404);
            res.jsonp({'message' : 'Error obteniendo ayudas', 'reason' : err});
        });
});

router.post('/', (req, res) => {
    helpService
        .createHelp(req.body._id, req.body.beneficiary, req.body.helpType, req.body.date, req.body.entity, req.body.notes, req.body.user)
        .then(helpService.insertHelp)
        .then(help => { res.jsonp(help) })
        .catch(err => {
            res.status(404);
            res.jsonp({'message' : 'Error insertando nueva ayuda', 'reason' : err});
        });
});

router.put('/', (req, res) => {
    helpService
        .createHelp(req.body._id, req.body.beneficiary, req.body.helpType, req.body.date, req.body.entity, req.body.notes, req.body.user)
        .then(help => helpService.updateHelp(help))
        .then(help => { res.jsonp(help) })
        .catch(err => {
            res.status(404);
            res.jsonp({'message' : 'Error actualizando ayuda', 'reason' : err});
        });
});

module.exports = router;