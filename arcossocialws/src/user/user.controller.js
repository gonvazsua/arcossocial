const express = require('express');
const router = express.Router();
const userService = require("./user.service");

router.get('/count', (req, res) => {
    userService
        .countUsers(req.query)
        .then(users => { res.jsonp(users) })
        .catch(err => {
            res.status(404);
            res.jsonp({'message' : 'Error obteniendo usarios', 'reason' : err});
        });
});

router.get('/', (req, res) => {
    userService
        .findUsers(req.query)
        .then(users => { res.jsonp(users) })
        .catch(err => {
            res.status(404);
            res.jsonp({'message' : 'Error obteniendo usuarios', 'reason' : err});
        });
});

router.post('/', (req, res) => {
    userService
        .create(req.body.fullName, req.body.base64Pass, req.body.entityCode, req.body.isAdmin)
        .then(user => { res.jsonp(user) })
        .catch(err => {
            res.status(404);
            res.jsonp({'message' : 'Error insertando nuevo usuario', 'reason' : err});
        });
});

router.put('/', (req, res) => {
    userService
        .buildUser(req.body._id, req.body.userCode, req.body.fullName, req.body.password, req.body.entityCode, req.body.isAdmin, req.body.isActive, req.body.creationDate)
        .then(user => userService.updateUser(user))
        .then(user => { res.jsonp(user) })
        .catch(err => {
            res.status(404);
            res.jsonp({'message' : 'Error actualizando usuario', 'reason' : err});
        });
});

module.exports = router;