'use strict';

var gulp = require('gulp');
var del = require('del');
var browserSync = require('browser-sync');
var mergeStream = require('merge-stream');
var browserify = require('browserify');
var watchify = require('watchify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');

// load Gulp plugins
var $ = require('gulp-load-plugins')();


/* ------------------
 * PRIVATE GULP TASKS
 * ------------------ */

function clean() {
	return del([
		'build/**/*'
	]);
}

function buildCSS() {
	return gulp.src('src/styles/main.scss')
		.pipe($.sourcemaps.init())
		.pipe($.sass().on('error', $.sass.logError))
		.pipe($.autoprefixer())
		.pipe($.concat('style.css'))
		.pipe($.cleanCss())
		.pipe($.sourcemaps.write('.'))
		.pipe(gulp.dest('build/css'))
		.pipe($.size({
			title: 'styles'
		}));
}

function buildJS() {
	return browserify({
			entries: 'src/scripts/main.js',
			debug: true
		})
		.transform(babelify, {presets: ['es2016']})
		.bundle()
		.pipe(source('bundle.js'))
		.pipe(buffer())
		.pipe($.eslint())
		.pipe($.eslint.format())
		.pipe($.uglify())
		.pipe(gulp.dest('build/js'))
		.pipe($.size({
			title: 'scripts'
		}));
}

function revision() {
	var styles = gulp.src('build/css/**/*.css', {base: 'build'});
	var scripts = gulp.src('build/js/**/*.js', {base: 'build'});
	return mergeStream(scripts, styles)
		.pipe($.rev())
		.pipe(gulp.dest('build'))
		.pipe($.revDeleteOriginal())
		.pipe($.rev.manifest('rev-manifest.json'))
		.pipe(gulp.dest('build'));
}

function updateHTML() {
	return gulp.src('src/index.html')
		.pipe($.revReplace({
			manifest: gulp.src('./build/rev-manifest.json')
		}))
		.pipe(gulp.dest('build'))
		.pipe(browserSync.stream());
}

function startServer() {
	browserSync.init({
		server: './build'
	});
}

function watch() {
	gulp.watch([
		'src/scripts/**/*.js',
		'src/styles/**/*.scss',
		'src/index.html'
	], gulp.series('build'));
}


/* -----------------
 * PUBLIC GULP TASKS
 * Intended for CLI
 * ----------------- */

gulp.task('build', gulp.series(
		clean,
		gulp.parallel(buildCSS, buildJS),
		revision,
		updateHTML
	)
);

gulp.task('serve', gulp.parallel(startServer, watch));

gulp.task('default', gulp.series('build', 'serve'));
