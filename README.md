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

#### options.punctuation
Type: `String`
Default value: `'.'`

A string value that is used to do something else with whatever else.

#### options.jsSetMin
Type: `Boolean`
Default value: `false`

Change references to bower component in files.

#### Custom Options
Custom options...

```js
grunt.initConfig({
  version_bower_components: {
    options: {
      something: '',
      jsSetMin: true,
    }
  }
});
```


