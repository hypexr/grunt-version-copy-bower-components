# What is it?

Simple pure Javascript timer.

Just a wrapper for `setTimeout`, `clearTimeout` functions with human-readable
interfaces.

```javascript
// Define a new deferred task
var task = new Timer(function() { console.log('DONE'); }, 5e3);

// then pause for some reasons
task.pause()

// and resume
task.resume()

// or even restart
task.restart();
```

## License

Licensed under the MIT license.

## Copyrights

Copyrights © 2013 by Vital Kudzelka <vital.kudzelka@gmail.com>.
