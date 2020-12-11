const express = require('express');
const router = express.Router();
const userService = require("./user.service");

router.get('/count', (req, res) => {
    userService
        .countUsers(req.query)
        .then(users => { res.jsonp(users) })
        .catch(err => {
            console.log(err);
            res.status(404);
            res.jsonp({'message' : 'Error obteniendo usarios', 'reason' : err});
        });
});

router.get('/', (req, res) => {
    userService
        .findUsers(req.query)
        .then(users => { res.jsonp(users) })
        .catch(err => {
            console.log(err);
            res.status(404);
            res.jsonp({'message' : 'Error obteniendo usuarios', 'reason' : err});
        });
});

router.post('/', (req, res) => {
    userService
        .create(req.body.fullName, req.body.password, req.body.entityCode, req.body.isAdmin)
        .then(user => { res.jsonp(user) })
        .catch(err => {
            console.log(err);
            res.status(404);
            res.jsonp({'message' : 'Error insertando nuevo usuario', 'reason' : err});
        });
});

router.put('/updatePassword', (req, res) => {
    userService.updatePasswordUser(req.body.userCode, req.body.password)
        .then(result => { res.jsonp(result) })
        .catch(err => {
            console.log(err);
            res.status(404);
            res.jsonp({'message' : 'Error actualizando contraseña usuario', 'reason' : err});
        });
});

router.put('/setActivateByEntityCode', (req, res) => {
    userService
        .setActivateByEntityCode(req.body.entityCode, req.body.isActive)
        .then(result => { res.jsonp(true) })
        .catch(err => {
            console.log(err);
            res.status(404);
            res.jsonp({'message' : 'Error desactivando usuarios para entidad ' + req.body.entityCode, 'reason' : err});
        });
});

router.put('/', (req, res) => {
    userService
        .buildUser(req.body._id, req.body.userCode, req.body.fullName, req.body.password, req.body.entityCode, req.body.isAdmin, req.body.isActive, req.body.creationDate)
        .then(user => userService.updateUser(user))
        .then(user => { res.jsonp(user) })
        .catch(err => {
            console.log(err);
            res.status(404);
            res.jsonp({'message' : 'Error actualizando usuario', 'reason' : err});
        });
});

module.exports = router;