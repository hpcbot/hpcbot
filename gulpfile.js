var gulp = require('gulp');

var nodemon = require('gulp-nodemon');
var mocha = require('gulp-mocha');
var casper = require('gulp-casperjs-local').default;

gulp.task('test', function() {
	return gulp
		.src(['lib/**/*.spec.js'])
		.pipe(mocha());
});

gulp.task('testclient', ['server', 'casper'], function() {
	process.exit(1);
});

gulp.task('casper', function() {
	return gulp
		.src(['lib/**/*.test.js'])
		.pipe(casper());
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
		script: 'lib/server/server.js',
		ext: '.js',
		ignore: ['*.spec.js', '*.test.js']
	});
});