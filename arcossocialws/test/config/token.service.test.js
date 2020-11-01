const assert = require('assert');
const tokenService = require("../../src/config/token.service");

describe('Token Service Test', () => {

  describe('#generateToken()', () => {
    it('Should return the generated login Token', () => {
      const token = tokenService.generateToken('1');
      assert.notStrictEqual(token, null);
    });
  });

});