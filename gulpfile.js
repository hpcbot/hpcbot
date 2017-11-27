var gulp = require('gulp');

var nodemon = require('gulp-nodemon');
var mocha = require('gulp-mocha');
var casper = require('gulp-casperjs-local').default;

/* Tests */
gulp.task('test', ['mocha']);

gulp.task('watch', function() {
	// Run server-side tests whenever a server-side test changes
	gulp.watch(['lib/**/*.js', 'models/**/*.js'], ['mocha']);
});

gulp.task('mocha', function() {
	// Run server-side tests once
	return gulp
		.src(['lib/**/*.spec.js', 'models/**/*.spec.js'])
		.pipe(mocha({ exit: true }));
});

/* Launch the app or parts of it */
gulp.task('start', function() {
  // Start the app
  nodemon({
  	script: 'index.js'
  });
});
