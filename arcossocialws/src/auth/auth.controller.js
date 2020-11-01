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
            res.send('Login incorrecto');
        })
});

module.exports = router;