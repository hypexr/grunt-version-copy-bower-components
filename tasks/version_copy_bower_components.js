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
        grunt.log.debug("Obtaining package version for " + key);

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

        grunt.log.debug(key + " - version: " + componentData['version'] + " directory: " + componentData['directory']);

        processDependencies(dependency.dependencies, components, exclude);
    });
  }

  function copyBowerComponent(srcFiles, dest, componentName) {
    grunt.log.debug("Copying: " + componentName + ' to: ' + dest);
    grunt.file.expand({filter: 'isFile'}, srcFiles).forEach(function(file) {
      var finalDestination = dest + file.replace(new RegExp('^.*?' + componentName), '');
      grunt.file.copy(file, finalDestination);
    });
    grunt.log.ok("Copied: " + componentName + ' to: ' + dest);
  }

  function fixReferencingComponents(destBasePath, fileName, components, useComponentMin, optionsDest) {
    grunt.log.debug('File name: ' + fileName);

    // Iterate over each component and fix references to bower components
    Object.keys(components).forEach(function(componentName) {
      var file = grunt.file.read(fileName);
      var newFile = '';

      // Find replace file with the new path including the version number
      var baseDirParts = components[componentName].directory.split('/');
      var baseDir = path.join(baseDirParts[baseDirParts.length - 2], baseDirParts[baseDirParts.length - 1]);
      var originalPathRegex = new RegExp(baseDir, 'g');
      var newFilePath = path.join(destBasePath, componentName + '-' + components[componentName].version);

      var newPath = path.relative(path.resolve(fileName), path.resolve(newFilePath)).replace(/^..\//, '');

      grunt.log.debug("Replacing " + baseDir + ' with ' + newPath);
      file = file.replace(originalPathRegex, newPath);
      grunt.log.ok(componentName + ' modified to reference version ' + components[componentName].version + ' in ' + fileName);

      if(useComponentMin) {
        // Replace component file name with the minified version
        var escapedNewPath = newPath.replace(/\//g, '\\/');
        var componentReferenceRegex = new RegExp(escapedNewPath + '(.+)[\'"]');

        // Check each line for component
        file.split('\n').forEach(function(line) {
            var matches = line.match(componentReferenceRegex);
            var match = false;
            if(matches != null) {
              // verify that match 1 exists
              if(matches[1] != null) {
                var componentFn = matches[1];
                var componentFnParts = componentFn.split('.');
                var componentFnMin = componentFn.substr(0, componentFn.lastIndexOf(".")) + ".min" + componentFn.substr(componentFn.lastIndexOf("."), componentFn.length);
                var newComponentPath = matches[0].replace(matches[1], componentFnMin).replace(/["']/, '');

                var componentFilePath = path.resolve(optionsDest, path.join('../', newComponentPath));

                grunt.log.debug("Checking if minified file exists " + componentFilePath);
                // If the minified file exists use it
                if(fs.existsSync(componentFilePath)) {
                  newFile += line.replace(componentFn, componentFnMin) + '\n';
                  grunt.log.ok(componentName + ' set to use minified library: ' + newComponentPath);
                  match = true;
                }
              }
            }
            if(! match) {
              newFile += line + '\n';
            }
        });
      }
      grunt.file.write(fileName, newFile);
    });
  }

  grunt.registerTask('versionCopyBowerComponents', 'Version and stage Bower components for release.', function() {
    // Set default options
    var options = this.options({
      exclude: [],
      dest: 'dist/libs',
      filesReferencingComponents: {},
    });

    // Normalize dest location
    options.dest = path.normalize(options.dest);

    // Set default value for filesReferencingComponents
    if(! ('files' in options.filesReferencingComponents)) {
      options.filesReferencingComponents['files'] = [];
    } else {
      options.filesReferencingComponents.files.map(function(item, idx) {
          // Save normalized filename
          options.filesReferencingComponents.files[idx] = path.normalize(item);
      });
    }
    if(! ('useComponentMin' in options.filesReferencingComponents)) {
      options.filesReferencingComponents['useComponentMin'] = false;
    }

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
 
      // Iterate over each package and move it to dist with a version
      Object.keys(components).forEach(function(componentName) {
        // Verify that the component exists on the file system
        if(! fs.existsSync(components[componentName].directory)) {
          grunt.fatal("The provided bowerComponentsDirectory (" + components[componentName].directory + ") doesn't exist");
        }

        var srcFiles = path.join(components[componentName].directory, '**');
        var dest = path.join(options.dest, componentName + '-' + components[componentName].version);

        copyBowerComponent(srcFiles, dest, componentName);
      });

      // Iterate over filesReferencingComponents and fix references
      options.filesReferencingComponents.files.forEach(function(fileName) {
        fixReferencingComponents(options.dest,
          fileName,
          components,
          options.filesReferencingComponents.useComponentMin,
          options.dest
        );
      });

      done();
    })
    .on('error', function (error) {
      grunt.log.error(error);
      done(false);
    });
  });
};

