const gulp = require('gulp')
const eslint = require('gulp-eslint')
const beautify = require('gulp-beautify')

gulp.task('dev', () => {
    return gulp.src(['**/*.js', '!node_modules/**'])
        // Beautify
        .pipe(beautify())
        .pipe(gulp.dest('.'))
        // Lintify
        .pipe(eslint())
        .pipe(eslint.formatEach())
        .pipe(eslint.failAfterError())
})

gulp.task('default', ['dev'], () => {})