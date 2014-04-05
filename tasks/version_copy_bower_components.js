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
  function processDependencies(dependencies, components, exclude) {
    Object.keys(dependencies).forEach(function(key) {
        var dependency = dependencies[key];
        var pkgMeta = dependency.pkgMeta;

        if(exclude.indexOf(pkgMeta.name) > -1) {
            grunt.log.ok('Excluding component: ' + pkgMeta.name);
            return;
        }

        var componentData = {};
        componentData['version'] = pkgMeta.version;
        componentData['directory'] = dependency.canonicalDir;
        components[pkgMeta.name] = componentData;
        processDependencies(dependency.dependencies, components, exclude);
    });
  }

  function copyBowerComponent(srcFiles, dest, componentName) {
    grunt.log.writeln("Copying: " + componentName + ' to: ' + dest);

    grunt.file.expand({filter: 'isFile'}, srcFiles).forEach(function(file) {
        var finalDestination = dest + file.replace('bower_components/' + componentName, '');
        finalDestination = finalDestination.replace(finalDestination.split('/')[-1], '');
        grunt.file.copy(file, finalDestination);
    });
  }

  grunt.registerTask('versionCopyBowerComponents', 'Version and stage Bower components for release.', function() {
    // Set default options
    var options = this.options({
      exclude: [],
      dest: 'dist/libs',
      filesReferencingComponents: [],
      jsSetMin: false
    });

    var done = this.async();
    var components = {};
    bower.commands
    .list([], {
      offline: true
    })
    .on('end', function (results) {
      processDependencies(results.dependencies, components, options.exclude);
    
      grunt.log.ok("Successfully obtained grunt packages and versions");
      Object.keys(components).forEach(function(componentName) {
        grunt.log.writeln('   ' + componentName + ': ' + components[componentName].version);
      });

      //// Read files that include bower components
      //var indexHtml = grunt.file.read(options.indexHtml);
      
      // Iterate over each package and move it to dist with a version
      Object.keys(components).forEach(function(componentName) {
        // Verify that the component exists on the file system
        if(! fs.existsSync(components[componentName].directory)) {
          grunt.fatal("The provided bowerComponentsDirectory (" + components[componentName].directory + ") doesn't exist");
        }

        var srcFiles = path.join(components[componentName].directory, '**');
        var dest = path.join(options.dest, componentName + '-' + components[componentName].version);

        copyBowerComponent(srcFiles, dest, componentName);

        // Find replace on html file with the new path including the version number
        var originalLibPath = new RegExp('bower_components/' + componentName + '/', 'g');
        var newLibPath = 'libs/' + componentName + '-' + components[componentName].version + '/';
        //indexHtml = indexHtml.replace(originalLibPath, newLibPath);
        grunt.log.ok('Fixed references to ' + componentName + ' to include version ' + components[componentName].version + ' in ..file..');


        //if(options.jsSetMin) {
        //  indexHtml = indexHtml.replace(/\.js/g, '.min.js');
        //  grunt.log.ok('Modified ..file.. to use minified js libraries');
        //}

        //grunt.file.write(options.indexHtml, indexHtml);
      });
      done();
    })
    .on('error', function (error) {
      grunt.log.error(error);
      done(false);
    });
  });
};

