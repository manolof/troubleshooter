(function() {
	'use strict';

	var gulp = require('gulp');
	var sass = require('gulp-sass');
	var jscs = require('gulp-jscs');
	var uglify = require('gulp-uglify');
	var concat = require('gulp-concat');
	var del = require('del');
	var rename = require('gulp-rename');
	var sourcemaps = require('gulp-sourcemaps');
	var autoprefixer = require('gulp-autoprefixer');
	var browserSync = require('browser-sync').create();
	var browserify = require('browserify');
	var source = require('vinyl-source-stream');

	// Directories & paths

	var stylesSrc = './src/css/';

	var dist = {
		css: './dist/css/',
		fonts: './dist/fonts/',
		js: './dist/js/'
	};

	var paths = {
		sass: stylesSrc + '*.scss',
		nodeModules: './node_modules/',
		ngApp: './app/app.js',
		ngCtrl: './app/controllers.js',
		ngCfg: './app/config.js',
		ngAll: ['./app/app.js', './app/controllers.js', './app/config.js']
	};

	var pluginsCss = [
		paths.nodeModules + 'angular-ui-notification/dist/angular-ui-notification.min.css',
		paths.nodeModules + 'font-awesome/css/font-awesome.min.css',
		paths.nodeModules + 'ng-dialog/css/ngDialog.min.css',
		paths.nodeModules + 'ng-dialog/css/ngDialog-theme-default.min.css',
		// paths.nodeModules + 'v-accordion/dist/v-accordion.min.css', // custom inside our scss
		paths.nodeModules + 'v-button/dist/v-button.min.css'
	];
	// Browserify
	gulp.task('browserify', function() {
		return browserify(paths.ngApp)
			.bundle()
			.pipe(source('app.js'))
			.pipe(gulp.dest(dist.js));
	});

	// JSCS
	gulp.task('jscs', function() {
		return gulp.src(paths.ngAll)
			.pipe(jscs())
			.pipe(jscs.reporter());
	});

	// BrowserSync
	gulp.task('browser-sync', ['watch'], function() {
		return browserSync.init(null, {
			port: 55999
		});
	});

	// Styles
	gulp.task('styles:app', ['styles:clean'], function() {
		return gulp
			.src(paths.sass, {base: stylesSrc})
			.pipe(sourcemaps.init())
			.pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
			.pipe(concat('app.min.css'))
			.pipe(sourcemaps.write())
			.pipe(gulp.dest(dist.css))
			.pipe(browserSync.reload({stream: true}));
	});

	gulp.task('styles:plugins', ['styles:clean'], function() {
		return gulp
			.src(pluginsCss, {base: paths.nodeModules})
			.pipe(sourcemaps.init())
			.pipe(concat('plugins.min.css'))
			.pipe(sourcemaps.write())
			.pipe(gulp.dest(dist.css))
			.pipe(browserSync.reload({stream: true}));
	});

	gulp.task('copyfonts', function() {
		return gulp
			.src(paths.nodeModules + 'font-awesome/fonts/**/*.{ttf,woff,woff2,eof,svg}')
			.pipe(gulp.dest(dist.fonts));
	});

	// Combine
	gulp.task('styles', ['styles:app', 'styles:plugins']);

	// Clean
	gulp.task('styles:clean', function() {
		return del(dist + '**/*.css');
	});

	// Watch
	gulp.task('styles:watch', function() {
		return gulp.watch(paths.sass, ['styles', 'copyfonts']);
	});

	// Scripts
	gulp.task('scripts', ['scripts:clean', 'jscs', 'browserify']); // alias

	// Clean
	gulp.task('scripts:clean', function() {
		return del(dist.js + '**/*.js');
	});

	// Watch
	gulp.task('scripts:watch', function() {
		return gulp.watch(paths.ngAll, ['scripts']);
	});

	gulp.task('clean', ['styles:clean', 'scripts:clean']);

	gulp.task('watch', ['styles:watch', 'scripts:watch']);

	// Default
	gulp.task('default', ['styles', 'copyfonts', 'scripts']);
}());
