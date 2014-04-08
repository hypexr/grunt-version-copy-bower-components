/*
 * grunt-version-copy-bower-components
 * http://gruntjs.com/
 *
 * Copyright (c) 2014 "hypexr" Scott Rippee, contributors
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/**/*.js',
        '<%= nodeunit.tests %>'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp']
    },

    copy: {
      main: {
        files: [
          { expand: true, flatten: true, src: ['test/fixtures/test.html', 'test/fixtures/test.css'], dest: 'tmp' },
        ]
      }
    },

    // Configuration to run (and then test)
    versionCopyBowerComponents: {
      options: {
        exclude: ['underscore'],
        dest: 'tmp/libs',
        filesReferencingComponents: {
          files: ['tmp/test.html', 'tmp/test.css'],
          componentsBasePath: 'libs',
          useComponentMin: true
        }
      }
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js']
    }

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-contrib-copy');
  
  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', [
    'jshint',
    'clean',
    'copy',
    'versionCopyBowerComponents',
    'nodeunit'
  ]);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['test']);

};

