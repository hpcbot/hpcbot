var _ = require('.');
var assert = require('chai').assert;

describe('utils', function() {
  describe('get - option 1 if option 2 is null', function() {
    it('1 null: 1', function() {
      var result = _.get(1, null);
      assert.equal(result, 1);
    });
    it('1 2: 2', function() {
      var result = _.get(1, 2);
      assert.equal(result, 1);
    });
    it('null 2: 2', function() {
      var result = _.get(null, 2);
      assert.equal(result, null);
    });
  });
});
