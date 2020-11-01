const {MongoClient} = require('mongodb');
const environment = require('./environment');

var db = null;


exports.getConnection = callback => {

    const client = new MongoClient(environment.variables.uri);
 
    try {
        
        if(db == null) {
            console.log("Trying to connect: " + environment.variables.uri);
            client.connect().then(c => {
                const database = client.db(environment.variables.database);
                db = database;
                callback(db, null);
            });
        } else {
            callback(db, null);
        }
        
 
    } catch (e) {
        console.error(e);
        callback(null, e);
    }

}