'use strict';

const gulp = require('gulp');
const del = require('del');
const { rollup } = require('rollup');
const { babel } = require('@rollup/plugin-babel');
const nodeResolve = require('@rollup/plugin-node-resolve').default;
const commonjs = require('@rollup/plugin-commonjs');
const terser = require('@rollup/plugin-terser');
const browserSync = require('browser-sync').create();
const fs = require('fs');
const modernizr = require('modernizr');
const modernizrConfig = require('./modernizr-config');
const ghPages = require('gulp-gh-pages');
const { exec } = require('child_process'); // ✅ for running CLI tools

// ✅ Gulp plugins
const autoprefixer = require('autoprefixer');
const postcss = require('gulp-postcss');
const addSrc = require('gulp-add-src');
const cleanCss = require('gulp-clean-css');
const concat = require('gulp-concat');
const htmlmin = require('gulp-htmlmin');
const jshint = require('gulp-jshint');
const sassCompiler = require('gulp-sass');

// ✅ Dart Sass
const dartSass = require('sass');
const gulpSass = sassCompiler(dartSass);

// -------------------- Lint tasks --------------------
function lintScripts() {
  return gulp.src('js/scripts.js')
    .pipe(jshint({ esversion: 6 }))
    .pipe(jshint.reporter('default'))
    .pipe(jshint.reporter('fail'));
}

const lint = gulp.parallel(lintScripts);

// -------------------- Build tasks --------------------
function buildMarkup() {
  return gulp.src('*.html')
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('dist/'));
}

function buildStyles() {
  return gulp.src('css/styles.scss')
    .pipe(gulpSass()) // ✅ Dart Sass
    .pipe(postcss([autoprefixer({ overrideBrowserslist: ['last 2 versions'] })]))
    .pipe(addSrc.prepend('node_modules/normalize.css/normalize.css'))
    .pipe(concat('styles.min.css'))
    .pipe(cleanCss())
    .pipe(gulp.dest('dist/'));
}

async function buildScripts() {
  const bundle = await rollup({
    input: 'js/scripts.js',
    plugins: [
      babel({
        babelHelpers: 'bundled',
        exclude: 'node_modules/**',
        presets: ['@babel/preset-env']
      }),
      nodeResolve(),
      commonjs(),
      terser() // ✅ Minify with Rollup's terser plugin
    ]
  });

  await bundle.write({
    file: 'dist/scripts.min.js',
    format: 'iife',
    name: 'MyBundle',
    sourcemap: true
  });
}

function buildModernizr(done) {
  modernizr.build(modernizrConfig, function(code) {
    fs.mkdirSync('dist', { recursive: true });
    fs.writeFileSync('dist/modernizr-build.min.js', code);
    done();
  });
}

function copyImages() {
  return gulp.src('images/**/*')
    .pipe(gulp.dest('dist/images/'));
}

function copyData() {
  return gulp.src('data/**/*')
    .pipe(gulp.dest('dist/data/'));
}

const build = gulp.parallel(buildMarkup, buildStyles, buildScripts, buildModernizr, copyImages, copyData);

// -------------------- Clean --------------------
function clean() {
  return del('dist/');
}

// -------------------- Serve --------------------
function serve() {
  browserSync.init({
    server: 'dist/',
    ghostMode: false,
    logFileChanges: true,
    https: true
  });

  gulp.watch('*.html', buildMarkup).on('change', browserSync.reload);
  gulp.watch('css/**/*.scss', gulp.series(buildStyles)).on('change', browserSync.reload);
  gulp.watch('js/**/*.js', gulp.series(lintScripts, buildScripts)).on('change', browserSync.reload);
  gulp.watch('images/**/*', copyImages).on('change', browserSync.reload);
  gulp.watch('data/**/*', copyData).on('change', browserSync.reload);
}

// -------------------- Deploy --------------------
function deploy() {
  return gulp.src(['./dist/**/*', './CNAME'])
    .pipe(ghPages());
}

// -------------------- Default --------------------
exports.clean = clean;
exports.lint = lint;
exports.build = build;
exports.serve = gulp.series(build, serve);
exports.deploy = deploy;
exports.default = gulp.series(lint, build);
