const express = require('express');
const router = express.Router();
const userService = require("./user.service");

router.get('/', (req, res) => {
    userService
        .findUsers(req.query)
        .then(users => { res.jsonp(users) })
        .catch(err => {
            res.status(404);
            res.jsonp({'message' : 'Error obteniendo usuarios', 'reason' : err});
        });
});

module.exports = router;