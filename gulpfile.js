var gulp = require('gulp');
var uglify = require('gulp-uglify');
var usemin = require('gulp-usemin');
var minifyCss = require('gulp-minify-css');
var clean = require('gulp-clean');
var replace = require('gulp-replace');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');

gulp.task('sass', function() {
    gulp.src('src/css/scss/app.scss')
      .pipe(sass({style: 'expanded'}))
      .pipe(autoprefixer('last 2 version'))
      .pipe(gulp.dest('src/css/'));
});

gulp.task('deploy', function() {
  
  gulp.src('src/images/**/*')
    .pipe(gulp.dest('dist/images'));

  gulp.src('src/css/*')
    .pipe(gulp.dest('dist/css'));

  gulp.src('src/partials/*')
    .pipe(gulp.dest('dist/partials'));

  gulp.src(['src/*',
            '!src/index.html'])
    .pipe(gulp.dest('dist/'));

  gulp.src('src/index.html')
    .pipe(replace('<base href="/src/">','<base href="/">'))
    .pipe(usemin({ 
        js: [uglify({mangle:false}), 'concat']
    }))
      .pipe(gulp.dest('dist/'));
});