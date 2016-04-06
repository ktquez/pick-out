var gulp = require('gulp');
var clean = require('gulp-clean');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');
var cssmin = require('gulp-cssmin');
var csslint = require('gulp-csslint');
var autoPrefixer = require('gulp-autoprefixer');
var stripDebug = require('gulp-strip-debug');

gulp.task('clean', function(){
	return gulp.src('./dist/*')
		.pipe(clean());
});

gulp.task('jshint', function(){
	return gulp.src('./dev/*.js')
		.pipe(jshint())
		.pipe(jshint.reporter('default'));
});

gulp.task('csslint', function(){
	return gulp.src(['./dev/**/*.css', './dev/*.css'])
		.pipe(csslint({
			'adjoining-classes' : false,
		}))
		.pipe(csslint.reporter());
});

gulp.task('themes', function(){
	return gulp.src('./dev/themes/*.css')
		.pipe(autoPrefixer())
		.pipe(cssmin())
		.pipe(gulp.dest('./dist/themes/'));
});

gulp.task('style', ['csslint', 'themes'], function(){
	return gulp.src('./dev/*.css')
		.pipe(autoPrefixer())
		.pipe(cssmin())
		.pipe(concat('pickout.min.css'))
		.pipe(gulp.dest('./dist/'));
});

gulp.task('script', ['jshint'], function(){
	return gulp.src('./dev/*.js')
		.pipe(stripDebug())
		.pipe(uglify())
		.pipe(concat('pickout.min.js'))
		.pipe(gulp.dest('./dist/'));
});

gulp.task('default', ['clean', 'style', 'script']);