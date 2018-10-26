const cleancss = require('gulp-clean-css'),
  gulp = require('gulp'),
  gulpif = require('gulp-if'),
  plumber = require('gulp-plumber'),
  rimraf = require('rimraf'),
  sass = require('gulp-sass'),
  sassLint = require('gulp-sass-lint'),
  sourcemaps = require('gulp-sourcemaps');

const argv = require('minimist')(process.argv.slice(2));

const Destination = require('../lib/destination');
const onError = require('../lib/onError');

module.exports = function (config) {

  config = config || {};
  let destination = Destination.find(config);

  gulp.task('remove:scss', function (cb) {

    rimraf(destination, cb);

  });

  /**
   * Run files through csslint if a csslintrc
   * file is specified in the config.
   */
  gulp.task('lint:scss', function () {

    if (!config.lint.src) return;

    let opts = { formatter: 'stylish' };

    if (config.lint.csslintrc) {
      opts.configFile = config.lint.csslintrc;
    }

    return gulp.src(config.lint.src)
      .pipe(plumber(onError))
      .pipe(sassLint(opts))
      .pipe(sassLint.format());

  });

  gulp.task('compile:scss', ['remove:scss'], function () {

    return gulp.src(config.src)

      .pipe(plumber(onError))

      // Init sourcemaps (if not gulping for production use)
      .pipe(gulpif(!argv.production, sourcemaps.init()))

      // Run through sass compiler and create a source map if not gulping for production
      .pipe(sass())

      // Write sourcemaps (if not gulping for production use)
      .pipe(gulpif(!argv.production, sourcemaps.write()))

      // Minify files if gulping for production use
      .pipe(gulpif(argv.production, cleancss()))

      .pipe(gulp.dest(destination));

  });

  gulp.task('default:scss', ['lint:scss', 'compile:scss']);

  return gulp.tasks;

};
