'use strict';

const gulp          = require('gulp'),
  plugins         = require('gulp-load-plugins')(),
  del             = require('del'),
  rollup          = require('rollup-stream'),
  source          = require('vinyl-source-stream'),
  buffer          = require('vinyl-buffer'),
  babel           = require('rollup-plugin-babel'),
  nodeResolve     = require('rollup-plugin-node-resolve'),
  commonjs        = require('rollup-plugin-commonjs'),
  browserSync     = require('browser-sync').create();


gulp.task('default', ['lint', 'build']);

gulp.task('lint', ['lint:styles', 'lint:scripts']);

gulp.task('lint:styles', () => {
  return gulp.src('css/styles.scss')
    .pipe(plugins.stylelint({
      reporters: [
        { formatter: 'string', console: true }
      ]
    }));
});

gulp.task('lint:scripts', () => {
  return gulp.src('js/scripts.js')
    .pipe(plugins.jshint({
      esversion: 6
    }))
    .pipe(plugins.jshint.reporter('default'))
    .pipe(plugins.jshint.reporter('fail'));
});

gulp.task('build', ['build:markup', 'build:styles', 'build:scripts']);

gulp.task('build:markup', () => {
  return gulp.src('*.html')
    .pipe(plugins.htmlmin({
      collapseWhitespace: true
    }))
    .pipe(gulp.dest('dist/'));
});

gulp.task('build:styles', () => {
  return gulp.src('css/styles.scss')
    .pipe(plugins.sass())
    .pipe(plugins.autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(plugins.addSrc.prepend('node_modules/normalize.css/normalize.css'))
    .pipe(plugins.concat('styles.min.css'))
    .pipe(plugins.cleanCss())
    .pipe(gulp.dest('dist/'));
});

gulp.task('build:scripts', () => {
  return rollup({
    entry: 'js/scripts.js',
    format: 'iife',
    moduleName: 'MyBundle',
    plugins: [
      babel({
        exclude: 'node_modules/**',
        presets: ['es2015-rollup']
      }),
      nodeResolve({
        jsnext: true,
        main: true
      }),
      commonjs({
        include: 'node_modules/**',
        namedExports: {
          'node_modules/object-assign/index.js': ['objectAssign']
        }
      })
    ]
  })
  .pipe(source('scripts.min.js'))
  .pipe(buffer())
  .pipe(plugins.uglify())
  .pipe(gulp.dest('dist/'))
  .pipe(browserSync.stream());
});

gulp.task('clean', () => del('dist/'));

gulp.task('serve', () =>  {
  browserSync.init({
    server: 'dist/',
    ghostMode: false,
    logFileChanges: true
  });

  // Watch HTML files.
  gulp.watch('*.html', ['build:markup']);

  // Watch styles.
  gulp.watch('css/**/*.scss', ['lint:styles', 'build:styles']);

  // Watch scripts.
  gulp.watch('js/**/*.js', ['lint:scripts', 'build:scripts']);
});
