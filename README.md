[![Build Status](https://travis-ci.org/hypexr/grunt-version-copy-bower-components.svg)](https://travis-ci.org/hypexr/grunt-version-copy-bower-components)

# grunt-version-copy-bower-components

> This plugin copies Bower components into a staging directory with the component's versions appended to the directory name.  It will also fix references to the components in HTML or other specified files.  This aids in creating releases so caching layers will not serve stale libraries when there are updates and so that caches don't need to be updated with every deploy when the library version hasn't changed.

## Getting Started
This plugin requires Grunt `~0.4.4`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-version-copy-bower-components --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-version-copy-bower-components');
```

This plugin may not work with every bower component. Many of the popular ones have been tested, but if the components packaging is not standard there could be problems.

## The "versionCopyBowerComponents" task

### Overview
In your project's Gruntfile, add a section named `versionCopyBowerComponents` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  versionCopyBowerComponents: {
    options: {
      // Task-specific options go here.
    }
  }
});
```

### Options

#### options.dest
Type: `String`
Default value: `dist/libs`

The location to place the versioned bower components.

#### options.exclude
Type: `Array`
Default value: `[]`

Bower libraries that you don't want versioned and copied to the destination.

#### options.filesReferencingComponents.files
Type: `Array`
Default value: `[]`

An array of files that have references to bower components.  For example if you have installed bootstrap with bower and your html file is like:

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Test Page</title>
  <link rel="stylesheet" href="bower_components/bootstrap/dist/css/bootstrap.css">
  <script src="bower_components/bootstrap/dist/js/bootstrap.js">
</head>
<body>
</body>
</html>
```

you would list this file in the files array so that it is updated with the new bootstrap locations post versioning. All files that reference bower components should be listed here.

#### options.filesReferencingComponents.componentsBasePath
Type: `String`
Default value: `bower_components`

This is the relative path to the file that is referencing the bower component to the bower component's base directory.

For example:

If your dest is set to: 'dist/mylibs' and you have an index.html file in dist, the files array would include 'dist/index.html' and this would be set to 'mylibs'.

#### options.filesReferencingComponents.useComponentMin
Type: `Boolean`
Default value: `false`

Change references to bower component in files to use the .min in the filename if it exists.

#### Example Options

```js
grunt.initConfig({
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
  }
});
```

With these options all of the bower components except for underscore will be versioned and copied to 'tmp/libs'.

The files 'tmp/test.html' and 'tmp/test.css' will be modified with the correct paths to the bower components ('lib/component-version') and will use min in the file name if a minified resource exists.


