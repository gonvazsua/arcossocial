const {MongoClient} = require('mongodb');
const environment = require('./environment');

var client = null;
var db = null;



exports.getConnection = () => {

    return new Promise((resolve, reject) => {
 
        try {
            
            if(client == null || db == null) {
                client = new MongoClient(environment.getVars().uri);
                console.log("Trying to connect: " + environment.getVars().uri);
                client.connect().then(c => {
                    const database = c.db(environment.getVars().database);
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

exports.calculateSkip = (pageSize, pageNumber) => {
    if(pageSize && pageNumber) {
        return (parseInt(pageNumber)-1) * parseInt(pageSize);
    }
    return 0;
};

exports.calculateLimit = (pageSize) => {
    if(pageSize) {
        return parseInt(pageSize);
    }
    return 25;
};