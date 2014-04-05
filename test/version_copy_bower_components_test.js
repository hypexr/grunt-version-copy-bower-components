'use strict';

var grunt = require('grunt');
var fs = require('fs');
var path = require('path');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports.version_bower_components = {
  setUp: function(done) {
    // setup here if necessary
    done();
  },
  verifyNoExcludedComponents: function(test) {
    // Verify component present in bower, but listed in exclude is not present
    test.equal(fs.existsSync(path.join('tmp', 'underscore-1.6.0')), false, "Component listed in exclude shouldn't be present");
    test.done();
  },
  verifyExpectedPackages: function(test) {
    ['bootstrap-3.1.1', 'jquery-2.1.0', 'ember-1.5.0', 'handlebars-1.3.0'].forEach(function(component) {
      test.equal(fs.existsSync(path.join('tmp', component)), true, "Component " + component + " is missing");
    });
    test.done();
  }
  //default_options: function(test) {
  //  test.expect(1);

  //  var actual = grunt.file.read('tmp/default_options');
  //  var expected = grunt.file.read('test/expected/default_options');
  //  test.equal(actual, expected, 'should describe what the default behavior is.');

  //  test.done();
  //},
  //custom_options: function(test) {
  //  test.expect(1);

  //  var actual = grunt.file.read('tmp/custom_options');
  //  var expected = grunt.file.read('test/expected/custom_options');
  //  test.equal(actual, expected, 'should describe what the custom option(s) behavior is.');

  //  test.done();
  //},
};
