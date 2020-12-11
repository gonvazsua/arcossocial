const express = require('express');
const router = express.Router();
const authService = require("./auth.service");
const tokenService = require("../config/token.service");

router.post('/login', (req, res) => {
    const userCode = req.body.userCode;
    const password = req.body.password;
    authService
        .authenticate(userCode, password)
        .then(tokenService.generateToken)
        .then(token => { res.jsonp({'token' : token}) })
        .catch(err => {
            res.status(403);
            res.jsonp({'message' : 'Login incorrecto', 'reason' : err});
        });
});

router.post('/signup', (req, res) => {
    const user = req.body.user;
    authService
        .register(user.fullName, user.password, user.entityCode, user.isAdmin)
        .then(user => { res.jsonp({'user' : user}) })
        .catch(err => {
            res.status(403);
            res.jsonp({'message' : 'El usuario no ha sido creado', 'reason' : err});
        });
})

router.get('/info', (req, res) => {
    res.jsonp({'STATUS': 'OK'});
});

module.exports = router;