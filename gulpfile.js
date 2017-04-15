var gulp = require('gulp');

var nodemon = require('gulp-nodemon');
var mocha = require('gulp-mocha');
var casper = require('gulp-casperjs-local').default;

/* Tests */
gulp.task('test', ['mocha'], function() {
	gulp.run('testclient');
	// process.exit(1);
});

gulp.task('testclient', ['server', 'casper'], function() {
	process.exit(1);
});

gulp.task('watch', function() {
	// Run server-side tests whenever a server-side test changes
	gulp.watch(['lib/**/*.js', '!*.test.js', '!lib/server/static/*.js'], ['mocha']);
});

gulp.task('mocha', function() {
	// Run server-side tests
	return gulp
		.src(['lib/**/*.spec.js'])
		.pipe(mocha());
});

gulp.task('casper', function() {
	// Run client-side tests
	return gulp
		.src(['lib/**/*.test.js'])
		.pipe(casper());
});

/* Launch the app or parts of it */
gulp.task('start', function() {
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