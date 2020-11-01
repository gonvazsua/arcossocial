const express = require('express');
const router = express.Router();
const entityService = require('./entity.service');

router.get('/', (req, res) => {
    entityService
        .findEntities(req.query)
        .then(entities => { res.jsonp(entities) })
        .catch(err => {
            res.status(404);
            res.jsonp({'message' : 'Error obteniendo entidades', 'reason' : err});
        });
});

router.post('/', (req, res) => {
    entityService
        .createEntity(req.body._id, req.body.name, req.body.code, req.body.creationDate, req.body.isActive)
        .then(entityService.insertEntity)
        .then(entity => { res.jsonp(entity) })
        .catch(err => {
            res.status(404);
            res.jsonp({'message' : 'Error insertando nueva entidad', 'reason' : err});
        });
});

router.put('/', (req, res) => {
    entityService
        .createEntity(req.body._id, req.body.name, req.body.code, req.body.creationDate, req.body.isActive)
        .then(entity => entityService.updateEntity(entity))
        .then(entity => { res.jsonp(entity) })
        .catch(err => {
            res.status(404);
            res.jsonp({'message' : 'Error actualizando entidad', 'reason' : err});
        });
});

module.exports = router;