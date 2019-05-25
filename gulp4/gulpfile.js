const { src, dest, lastRun, series, parallel, watch } = require('gulp'),
    compass = require('gulp-compass'),
    rename = require('gulp-rename'),
    browserSync = require('browser-sync'),
    uglify = require('gulp-uglify'),
    cleanCSS = require('gulp-clean-css'),
    plumber = require('gulp-plumber'),
    imagemin = require('gulp-imagemin'),
    changed = require('gulp-changed');

// Minify css
function minifyCss()
{
    return src('app/css/*.css')
        .pipe(cleanCSS({
            compatibility: 'ie8' && 'ie9' && '*'

        }))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(dest('dist/css'))
        .pipe(browserSync.reload({
            stream: true
        }));
}

// Minify js
function minifyJs()
{
    return src('app/js/*.js')
        .pipe(uglify())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(dest('dist/js'))
        .pipe(browserSync.reload({
            stream: true
        }));
}

// Images
function images()
{
    return src('app/img/*', { since: lastRun(images) })
        .pipe(changed('dist/img'))
        .pipe(imagemin())
        .pipe(dest('dist/img'));
}

// Compass
function sass()
{
    return src('app/sass/style.scss')
        .pipe(plumber({
            errorHandler: function(error) {
                window.console.log(error.message);
                this.emit('end');
            }
        }))
        .pipe(compass({
            config_file: 'app/config.rb',
            css: 'app/css',
            sass: 'app/sass'
        }))
        .pipe(dest('app/css'))
        .pipe(browserSync.reload({
            stream: true
        }));
}

// BrowserSync
function browser()
{
    return browserSync.init({
        server: {
            baseDir: 'app/'
        }
    });
}

// Watch
function watcher()
{
    watch('app/sass/*.scss', sass);
    watch('app/css/*.css', minifyCss);
    watch('app/js/*.js', minifyJs);

    // Reloads browserSync whenever html or js files change
    watch('app/*.html', browserSync.reload({stream: true}));
    watch('app/js/**/*.js', browserSync.reload);
}

exports.default = series(sass, minifyCss, minifyJs, images, parallel(watcher, browser));
