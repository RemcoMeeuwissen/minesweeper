/* eslint-disable import/no-extraneous-dependencies */

const gulp = require('gulp');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const rename = require('gulp-rename');

gulp.task('javascript', () => browserify('./minesweeper/frontend.js')
  .transform('babelify', { presets: ['es2015'] })
  .transform('uglifyify')
  .bundle()
  .pipe(source('minesweeper.min.js'))
  .pipe(gulp.dest('./public/js')));

gulp.task('css', () => gulp.src('./public/css/style.css')
  .pipe(autoprefixer({
    browsers: ['last 2 versions'],
    cascade: false,
  }))
  .pipe(cleanCSS())
  .pipe(rename('style.min.css'))
  .pipe(gulp.dest('./public/css')));

gulp.task('default', ['javascript', 'css']);
