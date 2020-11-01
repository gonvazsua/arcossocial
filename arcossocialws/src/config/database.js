const {MongoClient} = require('mongodb');
const environment = require('./environment');

var client = null;
var db = null;



exports.getConnection = () => {

    return new Promise((resolve, reject) => {
 
        try {
            
            if(client == null || db == null) {
                client = new MongoClient(environment.variables.uri);
                console.log("Trying to connect: " + environment.variables.uri);
                client.connect().then(c => {
                    const database = c.db(environment.variables.database);
                    db = database;
                    resolve(db);
                });
            } else {
                resolve(db);
            }
            
    
        } catch (e) {
            console.error(e);
            reject(e);
        }
    });

}

exports.closeConnection = () => {
    if(client != null) {
        console.log("Closing Mongodb connection");
        client.close();
        client = null;
        db = null;
    }
}