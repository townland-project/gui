'use strict';

const
    fs = require('fs'),
    path = require('path'),
    gulp = require('gulp'),
    sass = require('gulp-sass')(require('sass')),
    sassImport = require('gulp-sass-glob'),
    sourcemaps = require('gulp-sourcemaps'),
    cleanCSS = require('gulp-clean-css'),
    rename = require("gulp-rename");

function clean(done) {
    for (let item of fs.readdirSync('./dist')) {
        if (item.includes('.css')) {
            fs.unlinkSync(path.join(__dirname, 'dist', item))
        }
    }

    done()
}

function build() {
    return gulp.src('./styles/styles.scss')
        .pipe(sassImport({
            'marker': '/*'
        }))
        .pipe(sourcemaps.init({ 'loadMaps': true }))
        .pipe(sass().on('error', sass.logError))
        .pipe(sourcemaps.write('.', { 'includeContent': false }))
        .pipe(gulp.dest('dist'));
}

function minify() {
    return gulp.src('dist/styles.css')
        .pipe(cleanCSS())
        .pipe(sourcemaps.init({ 'loadMaps': true }))
        .pipe(rename({
            suffix: '.min',
        }))
        .pipe(sourcemaps.write('.', { 'includeContent': false }))
        .pipe(gulp.dest('dist'));
}

gulp.task('clean', clean)

gulp.task('build', build)

gulp.task('build:minify', minify)

gulp.task('build:all', gulp.series('clean', 'build', 'build:minify'))

gulp.task('build:watch', () => {
    gulp.watch('./styles/**/*.scss', gulp.series('build', 'build:minify'))
})