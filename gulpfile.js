'use strict';

var gulp = require('gulp');
var del = require('del');
var browserSync = require('browser-sync');
var mergeStream = require('merge-stream');

// load Gulp plugins
var $ = require('gulp-load-plugins')();

gulp.task('clean', function () {
	return del([
		'build/**/*'
	]);
});

gulp.task('styles', function () {
	return gulp.src('src/styles/main.scss')
		.pipe($.sourcemaps.init())
		.pipe($.sass().on('error', $.sass.logError))
		.pipe($.autoprefixer())
		.pipe($.concat('style.css'))
		.pipe($.csso())
		.pipe($.sourcemaps.write('.'))
		.pipe(gulp.dest('build/css'))
		.pipe($.size({
			title: 'styles'
		}));
});

gulp.task('scripts', function () {
	return gulp.src('src/scripts/**/*.js')
		.pipe($.eslint())
		.pipe($.eslint.format())
		.pipe($.concat('bundle.js'))
		.pipe($.uglify())
		.pipe(gulp.dest('build/js'))
		.pipe($.size({
			title: 'scripts'
		}));
});

gulp.task('revision', ['styles', 'scripts'], function () {
	var styles = gulp.src('build/css/**/*.css', {base: 'build'});
	var scripts = gulp.src('build/js/**/*.js', {base: 'build'});
	return mergeStream(scripts, styles)
		.pipe($.rev())
		.pipe(gulp.dest('build'))
		.pipe($.revDeleteOriginal())
		.pipe($.rev.manifest('rev-manifest.json'))
		.pipe(gulp.dest('build'));
});

gulp.task('html', ['revision'], function() {
	return gulp.src('src/index.html')
		.pipe($.revReplace({
			manifest: gulp.src('./build/rev-manifest.json')
		}))
		.pipe(gulp.dest('build'))
		.pipe(browserSync.stream());
});

gulp.task('build', ['clean'], function() {
	gulp.start('html');
});

gulp.task('serve', function() {
	browserSync.init({
		server: './build'
	});
	gulp.watch([
		'src/scripts/**/*.js',
		'src/styles/**/*.scss',
		'src/index.html'
	], ['build']);
});

gulp.task('default', ['build'], function () {
	gulp.start('serve');
});
