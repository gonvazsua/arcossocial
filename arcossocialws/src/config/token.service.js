var env       = require('./environment');
var jwt       = require('jsonwebtoken');

exports.tokenVerify = function(req, res, next) {

	// check header or url parameters or post parameters for token
  	var token = req.body.token || req.query.token || req.headers['x-access-token'];

	// decode token
	if (token) {

    	// verifies secret and checks exp
    	jwt.verify(token, env.variables.secret, function(err, decoded) {      
      		if (err) {
            console.log(err);
        		return res.status(403).json({ success: false, message: 'Failed to authenticate token.' });    
      		} else {
        		// if everything is good, save to request for use in other routes
        		req.decoded = decoded;    
        		next();
      		}
    	});

  	} else {

	    // if there is no token, return an error
	    return res.status(403).send({ 
	        success: false, 
	        message: 'No token provided.' 
	    });

  	}

};

exports.generateToken = userId => {
    var payload = { userId: userId }
    return jwt.sign(payload, env.variables.secret, {expiresIn: env.variables.tokenExpire})
};
