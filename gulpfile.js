var gulp = require('gulp')
var coffee = require('gulp-coffee')

gulp.task('compile', function() {
    return gulp.src('coffee/**/*.{coffee, cson}')
        .pipe(coffee({bare: true}))
        .pipe(gulp.dest('out'))
})

gulp.task('watch', function() {
    return gulp.watch('coffee/**/*.{coffee, cson}', ['compile'])
})

gulp.task('default', ['watch'])
