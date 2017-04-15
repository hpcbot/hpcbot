var gulp = require('gulp');

var nodemon = require('gulp-nodemon');
var mocha = require('gulp-mocha');

gulp.task('test', function() {
	return gulp
		.src(['lib/**/*.spec.js'])
		.pipe(mocha());
});

gulp.task('app', function() {
  // Start the app
  nodemon({
  	script: 'app.js'
  });
});

gulp.task('server', function() {
	// Just start the server
	nodemon({
		script: 'lib/server/server.js'
	});
});