var gulp = require('gulp');
var clean = require('gulp-clean');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');


gulp.task('jshint', function(){
	return gulp.src('./dev/*.js')
		.pipe(jshint())
		.pipe(jshint.reporter('default'));
});

gulp.task('clean', function(){
	return gulp.src('./dist/*.js')
		.pipe(clean());
});

gulp.task('dist', ['clean'], function(){
	return gulp.src('./dev/*.js')
		.pipe(uglify())
		.pipe(concat('pickout.min.js'))
		.pipe(gulp.dest('./dist/'));
});

gulp.task('default', ['jshint', 'dist']);