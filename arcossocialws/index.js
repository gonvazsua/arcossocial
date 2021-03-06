const port = process.env.PORT || 3001;
const host = process.env.IP || 'localhost';
const config              = require('./src/config/config');
const express 		      = require("express"),
      app 			      = express(),
      bodyParser  	      = require("body-parser"),
      routes              = require("./routes"),
      database            = require("./src/config/database"),
      environment         = require('./src/config/environment');


// Middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(config.allowCrossDomain);   

routes.addRoutes(app);

database.getConnection()
    .then(db => { console.log("Connected to database successfully") })
    .catch(err => { console.error("ERROR connecting Database") });

//Handle errors
app.use(function (err, req, res, next) {
    console.error(err.stack)
    res.status(500).send(err.stack)
});
  
// Start server
app.listen(port, host, function() {
    var date = new Date();
    console.log("Started served in host:port " + host + ":" + port + " - " 
        + date.getFullYear() + "/" + date.getMonth() + "/" + date.getDay() + " - " 
        + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds());
    console.log("ENVIRONMENT: " + environment.getEnvironmentName());
});