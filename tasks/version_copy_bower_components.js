/*
 * grunt-version-bower-components
 * https://github.com/MultiSight/webclient
 *
 * Copyright (c) 2014 hypexr
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {
  var bower = require('bower');
  var async = require('async');
  var path = require('path');
  var fs = require('fs');

  // Obtain installed packages and version from bower
  function processDependencies(dependencies, components) {
    Object.keys(dependencies).forEach(function(key) {
        var dependency = dependencies[key];
        var pkgMeta = dependency.pkgMeta;
        components[pkgMeta.name] = pkgMeta.version;
        processDependencies(dependency.dependencies, components);
    });
  }

  grunt.registerTask('versionCopyBowerComponents', 'Version and stage Bower components for release.', function() {
    // Set default options
    var options = this.options({
      bowerComponentsDirectory: 'bower_components',
      indexHtml: 'dist/index.html',
      dest: 'dist/libs',
      jsSetMin: false
    });

    // Verify that bower's components directory
    if(! fs.existsSync(options.bowerComponentsDirectory)) {
      grunt.fatal("The provided bowerComponentsDirectory (" + options.bowerComponentsDirectory + ") doesn't exist");
    }

    var done = this.async();
    var components = {};
    bower.commands
    .list([], {
      offline: true
    })
    .on('end', function (results) {
      processDependencies(results.dependencies, components);
    
      grunt.log.ok("Obtained grunt packages and versions");
      Object.keys(components).forEach(function(key) {
        grunt.log.writeln('   ' + key + ': ' + components[key]);
      });

      //// Read files that include bower components
      //var indexHtml = grunt.file.read(options.indexHtml);
      
      // Iterate over each package and move it to dist with a version
      Object.keys(components).forEach(function(key) {
          var srcFiles = path.join(options.bowerComponentsDirectory, key, '/**');
          var dest = path.join(options.dest, key + '-' + components[key]);

          grunt.log.writeln("Copying: " + srcFiles + ' to: ' + dest);

          grunt.file.expand({ filter: 'isFile'}, srcFiles).forEach(function(file) {
              var finalDestination = dest + file.replace('bower_components/' + key, '');
              finalDestination = finalDestination.replace(finalDestination.split('/')[-1], '');
              grunt.file.copy(file, finalDestination);
          });

          // Find replace on html file with the new path including the version number
          var originalLibPath = new RegExp('bower_components/' + key + '/', 'g');
          var newLibPath = 'libs/' + key + '-' + components[key] + '/';
          //indexHtml = indexHtml.replace(originalLibPath, newLibPath);
          grunt.log.ok('Fixed references to ' + key + ' to include version ' + components[key] + ' in ..file..');


          //if(options.jsSetMin) {
          //  indexHtml = indexHtml.replace(/\.js/g, '.min.js');
          //  grunt.log.ok('Modified ..file.. to use minified js libraries');
          //}

          //grunt.file.write(options.indexHtml, indexHtml);
      });
      done();
    }).on('error', function (error) {
      grunt.log.error(error);
      done(false);
    });
  });
};

