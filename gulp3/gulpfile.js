var gulp = require('gulp'),
    compass = require('gulp-compass'),
    rename = require('gulp-rename'),
    browserSync = require('browser-sync'),
    uglify = require('gulp-uglify'),
    cleanCSS = require('gulp-clean-css'),
    plumber = require('gulp-plumber'),
    imagemin = require('gulp-imagemin'),
    changed = require('gulp-changed'),
    babel = require('gulp-babel');


// default task
gulp.task('default', ['compass', 'minify-css', 'minify-js', 'imagemin']);

// compass
gulp.task('compass', function() {
  return gulp.src('app/sass/style.scss')
    .pipe(plumber())
    .pipe(compass({
      config_file: 'app/config.rb',
      css: 'app/css',
      sass: 'app/sass'
    }))
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

// minify css
gulp.task('minify-css', ['compass'], function() {
  return gulp.src('app/css/style.css')
    .pipe(cleanCSS({
      compatibility: 'ie8' && 'ie9'
    }))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('dist/css'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

// minify js
gulp.task('minify-js', function() {
  return gulp.src('app/js/main.js')
    .pipe(babel())
    .pipe(uglify())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('dist/js'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

// imagemin
gulp.task('imagemin', function() {
  return gulp.src('app/img/*')
    .pipe(changed('dist/img'))
    .pipe(imagemin())
    .pipe(gulp.dest('dist/img'));
});

// browserSync
gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: 'app'
    },
  });
});

// watch task with browserSync
gulp.task('watch', ['browserSync', 'compass', 'minify-css', 'minify-js', 'imagemin'],function(){
  gulp.watch('app/sass/*.scss', ['compass']);
  gulp.watch('app/css/*.css', ['minify-css']);
  gulp.watch('app/js/*.js', ['minify-js']);
  // Reloads browserSync whenever html or js files change
  gulp.watch('app/*.html', browserSync.reload);
  gulp.watch('app/js/**/*.js', browserSync.reload);
});
