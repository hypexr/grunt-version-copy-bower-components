module.exports = function(grunt) {
  'use strict';

  // Project configuration.
  grunt.initConfig({

    // Metadata
    pkg: grunt.file.readJSON('package.json'),

    // Copyright placeholder
    copyright: '/*!\n' +
               ' * <%= pkg.name %> <%= pkg.version %>\n' +
               ' * Copyright © 2013-<%= grunt.template.today("yyyy") %> <%= pkg.author.name %> and other contibutors.\n' +
               ' * Licensed under the <%= pkg.license %> license http://vitalk.mit-license.org.\n' +
               ' */\n',

    clean: {
      dist: ['dist']
    },

    concat: {
      options: {
        banner: '<%= copyright %>'
      },
      dist: {
        src: 'src/timer.js',
        dest: 'dist/timer.js'
      }
    },

    uglify: {
      options: {
        banner: '<%= copyright %>'
      },
      build: {
        src: 'dist/timer.js',
        dest: 'dist/timer.min.js'
      }
    },

    watch: {
      js: {
        files: ['src/*.js'],
        tasks: 'dist'
      }
    }

  });

  // Cleanup source directory
  grunt.loadNpmTasks('grunt-contrib-clean');

  // Concatenate JavaScript sources
  grunt.loadNpmTasks('grunt-contrib-concat');

  // Uglify javascript source
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // The Big Brother watching you
  grunt.loadNpmTasks('grunt-contrib-watch');


  // Make a distribution bundle
  grunt.registerTask('dist', ['clean', 'concat', 'uglify'])

  // Default task
  grunt.registerTask('default', ['dist']);

}
