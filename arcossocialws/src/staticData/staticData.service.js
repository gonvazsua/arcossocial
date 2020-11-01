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