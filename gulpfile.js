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

	// Directories & paths

	var src = {
		css: 'src/css',
		js: 'src/js'
	};

	var dist = {
		css: 'dist/css',
		js: 'dist/js'
	};

	var paths = {
		css: {
			app: src.css + '/*.scss',
			plugins: src.css + '/plugins/*.css'
		},
		js: {
			app: src.js + '/*.js',
			plugins: src.js + '/plugins/*.js'
		}
	};

	// BrowserSync

	gulp.task('browser-sync', ['watch'], function() {
		return browserSync.init(null, {
			port: 55999
		});
	});

	// Styles

	gulp.task('styles:app', ['styles:clean'], function() {
		return gulp
			.src(paths.css.app, {base: src.css})
			.pipe(sourcemaps.init())
			.pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
			.pipe(concat('app.min.css'))
			.pipe(sourcemaps.write())
			.pipe(gulp.dest(dist.css))
			.pipe(browserSync.reload({stream: true}));
	});

	gulp.task('styles:plugins', ['styles:clean'], function() {
		return gulp
			.src(paths.css.plugins, {base: src.css})
			.pipe(sourcemaps.init())
			.pipe(concat('plugins.min.css'))
			.pipe(sourcemaps.write())
			.pipe(gulp.dest(dist.css))
			.pipe(browserSync.reload({stream: true}));
	});

	// Combine

	gulp.task('styles', ['styles:app', 'styles:plugins']);

	// Clean

	gulp.task('styles:clean', function() {
		return del(dist + '**/*.css');
	});

	// Watch

	gulp.task('styles:watch', function() {
		return gulp.watch(paths.css.app, ['styles']);
	});

	// Scripts

	gulp.task('scripts:app', function() {
		return gulp.src(paths.js.app)
			.pipe(sourcemaps.init())
			.pipe(jscs())
			.pipe(jscs.reporter())
			.pipe(uglify({mangle: false}))
			.pipe(concat('app.min.js'))
			.pipe(sourcemaps.write())
			.pipe(gulp.dest(dist.js))
			.pipe(browserSync.reload({stream: true}));
	});

	gulp.task('scripts:plugins', function() {
		return gulp.src([src.js + '/plugins/angular.min.js', paths.js.plugins])
			.pipe(sourcemaps.init())
			.pipe(uglify())
			.pipe(concat('plugins.min.js'))
			.pipe(sourcemaps.write())
			.pipe(gulp.dest(dist.js))
			.pipe(browserSync.reload({stream: true}));
	});

	// Combine

	gulp.task('scripts', ['scripts:app', 'scripts:plugins']);

	// Clean

	gulp.task('scripts:clean', function() {
		return del(dist + '**/*.js');
	});

	// Watch

	gulp.task('scripts:watch', function() {
		return gulp.watch(paths.js.app, ['scripts']);
	});

	gulp.task('clean', ['styles:clean', 'scripts:clean']);

	gulp.task('watch', ['styles:watch', 'scripts:watch']);

	// Default

	gulp.task('default', ['styles', 'scripts']);
}());
