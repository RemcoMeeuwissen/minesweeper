const gulp = require('gulp');
const browserify = require('browserify');
const source = require('vinyl-source-stream');

gulp.task('javascript', () => browserify('./minesweeper/frontend.js')
  .transform('babelify', { presets: ['es2015'] })
  .transform('uglifyify')
  .bundle()
  .pipe(source('minesweeper.min.js'))
  .pipe(gulp.dest('./public/js')));

gulp.task('default', ['javascript']);
