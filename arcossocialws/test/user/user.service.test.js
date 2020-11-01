const assert = require('assert');
const userService = require("../../src/user/user.service");
const dbConfig = require("../../src/config/database");

describe('Auth Service Test', () => {

  describe('#createUserCode()', () => {
    it('Should create an user code', () => {
      const entityCode = 'CA000';
      userService.createUserCode('CA')
        .then(userCode => {
          assert.strictEqual(userCode.length, 5);
        })
        .catch(err => assert.fail(err));
    });
  });

  describe('#create()', () => {
    it('Shoud create an user in database', () => {
      const password = 'MTIzNA=='; //1234
      userService.create('TestUser', password, 'CA', true)
        .then(user => {
          assert.notStrictEqual(user._id, null);
        })
        .catch(err => assert.fail(err));
    });
  });

  after(() => { 
    console.log("Cleaning connections and tables");
    setTimeout(() => {
      dbConfig.getConnection()
      .then(db => {
        db.collection(userService.USER_COLLECTION).deleteMany({'fullName' : 'TestUser'}, (err, res) => {
          console.log("Collection cleans: USER -> " + res);
        });
        //dbConfig.closeConnection();
      })
      .catch(err => assert.fail(err));
    }, 2000);
  });

});