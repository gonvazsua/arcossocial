const dbConfig = require("../config/database");
exports.STATIC_DATA_COLLECTION = "STATIC_DATA";

exports.findByName = name => {
    return new Promise((resolve, reject) => {
        const query = {'key': name};
        dbConfig.getConnection().then(db => {
            db.collection(this.STATIC_DATA_COLLECTION).find(query).toArray((err, res) => {
                if(err) reject(err);
                resolve(res);
            });
        });
    });
};

exports.updateByKey = (key, values) => {
    return new Promise((resolve, reject) => {
        const query = {$set : {values: values}};
        dbConfig.getConnection().then(db => {
            db.collection(this.STATIC_DATA_COLLECTION).updateOne({key: key}, query, (err, res) => {
                if(err) reject(err);
                else resolve(true);
            });
        });
    });
};