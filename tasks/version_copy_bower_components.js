/*
 * grunt-version-bower-components
 * https://github.com/MultiSight/webclient
 *
 * Copyright (c) 2014 hypexr
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  grunt.registerTask('versionCopyBowerComponents', 'Versions bower js libs', function() {

    // Set default options
    var options = this.options({
      bowerJson: 'bower.json',
      indexHtml: 'dist/index.html',
      dest: null,
      jsSetMin: false
    });

    // Read bower.json and create a hash of packages and versions
    var bowerData = grunt.file.readJSON(options.bowerJson);
    var packages = {};
    Object.keys(bowerData['dependencies']).forEach(function(key) {
        var value = bowerData['dependencies'][key].replace('~', '')
        packages[key] = value;
    });

    Object.keys(bowerData['resolutions']).forEach(function(key) {
        var value = bowerData['resolutions'][key].replace('~', '')
        packages[key] = value;
    });

    // Read index html
    var indexHtml = grunt.file.read(options.indexHtml);
    
    // Iterate over each package and move it to dist with a version
    Object.keys(packages).forEach(function(key) {
        var srcFiles = 'bower_components/' + key + '/**';
        var dest = options.dest + '/libs/' + key + '-' + packages[key];

        grunt.log.writeln("Copying: " + srcFiles + ' to: ' + dest);

        grunt.file.expand({ filter: 'isFile'}, srcFiles).forEach(function(file) {
            var finalDestination = dest + file.replace('bower_components/' + key, '');
            finalDestination = finalDestination.replace(finalDestination.split('/')[-1], '');
            grunt.file.copy(file, finalDestination);
        });

        // Find replace on html file with the new path including the version number
        grunt.log.writeln('Fixing references to bower_components/' + key + ' in ' + options.indexHtml);

        var originalLibPath = new RegExp('bower_components/' + key + '/', 'g');
        var newLibPath = 'libs/' + key + '-' + packages[key] + '/';
        indexHtml = indexHtml.replace(originalLibPath, newLibPath);
    });

    if(options.jsSetMin)
      indexHtml = indexHtml.replace(/\.js/g, '.min.js');

    grunt.file.write(options.indexHtml, indexHtml);
  });
};

