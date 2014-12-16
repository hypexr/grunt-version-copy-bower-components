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
    ['bootstrap-3.1.1', 'jquery-2.1.0', 'ember-1.5.0', 'handlebars-1.3.0', 'timer.js-0.1.1'].forEach(function(component) {
      test.equal(fs.existsSync(path.join('tmp', 'libs', component)), true, "Component " + component + " is missing");
    });
    test.done();
  },
  verifyTimerJsDist: function(test) {
    test.equal(fs.existsSync(path.join('tmp', 'libs', 'timer.js-0.1.1', 'dist')), true, "Timer.js dist directory is missing");
    test.done();
  },
  verifyFlotDist: function(test) {
    test.equal(fs.existsSync(path.join('tmp', 'libs', 'Flot-0.8.3')), true, "Flot directory directory is missing");
    test.equal(fs.existsSync(path.join('tmp', 'libs', 'Flot-0.8.3', 'jquery.flot.js')), true, 'jquery.flot.js is missing');
    test.done();
  },
  verifyModifiedHtmlFile: function(test) {
    test.expect(1);
    var actual = grunt.file.read('tmp/test.html');
    var expected = grunt.file.read('test/expected/test.html');

    test.equal(actual, expected, 'should be the same');
    test.done();
  },
  verifyModifiedCssFile: function(test) {
    test.expect(1);
    var actual = grunt.file.read('tmp/css/test.css');
    var expected = grunt.file.read('test/expected/test.css');

    test.equal(actual, expected, 'should be the same');
    test.done();
  }
};
