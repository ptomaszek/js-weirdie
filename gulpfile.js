var gulp = require('gulp'),
    flatten = require('gulp-flatten');

var libsSrc = [
    'node_modules/jquery/**/jquery.min.js',
    'node_modules/jquery.terminal/**/jquery.terminal.min.js',
    'node_modules/jquery.terminal/**/jquery.terminal.min.css',
    'node_modules/typed.js/**/typed.min.js'
];

gulp.task('libs', function () {
    gulp.src(libsSrc)
        .pipe(flatten())
        .pipe(gulp.dest('libs'));
});

gulp.task('default', ['libs']);