var gulp = require('gulp');
var gutil = require('gulp-util');
var plumber = require('gulp-plumber');

var argv = require('minimist')(process.argv.slice(2));
var browserify = require('browserify');
var concat = require('gulp-concat');
var rimraf = require('rimraf');
var gulpif = require('gulp-if');
var jshint = require('gulp-jshint');
// var sourcemaps = require('gulp-sourcemaps');
var through2 = require('through2');
var uglify = require('gulp-uglify');
var _ = require('underscore');

var Destination = require('../lib/destination');
var onError = require('../lib/onError');


module.exports = function (config) {

  config = config || {};
  var destination = Destination.find(config);

  /**
   * Remove previously compiled files
   * in preparation for newly compiled files.
   *
   */
  gulp.task('remove:js', function (cb) {

    rimraf(destination, cb);

  });

  /**
   * Run files through jshint if a jshintrc
   * file is specified in the config.
   */
  gulp.task('hint:js', function () {

    if (!config.hint || !config.hint.src) return;

    var hintconfig = config.hint.jshintrc || {};

    return gulp.src(config.hint.src)

      .pipe(plumber())
      .pipe(jshint(hintconfig))
      .pipe(jshint.reporter('jshint-stylish'));

  });

  /**
   * Compile JavaScript files
   *
   * Browserify technique borrowed from:
   * https://github.com/substack/node-browserify/issues/1044#issuecomment-72384131
   *
   * Due to `write after end` error when implementing:
   * https://github.com/gulpjs/gulp/blob/master/docs/recipes/browserify-uglify-sourcemap.md
   *
   */
  gulp.task('compile:js', ['remove:js'], function () {

    if (!config.compile.src) return;

    var transforms = config.compile.transform || [];

    return gulp.src(config.compile.src)

      .pipe(plumber(onError))

      .pipe(through2.obj(function (file, enc, callback) {

        var self = this;

        var b = browserify(file.path, { debug: !argv.production });

        _.each(transforms, function (transform) {

          var type = typeof transform;
          var opts = {};
          var t = function () {};

          if (type === 'function') {

            t = transform;

          } else if (type === 'object') {

            t = transform[0];
            opts = transform[1] || {};

          }

          b.transform(t, opts);

        });

        b.bundle(function (err, res) {

          if (err) {

            callback(new gutil.PluginError('Gulp Tasks', err));

          } else {

            file.contents = res;
            callback(null, file);

          }

        });

      }))

      // // Init sourcemaps (if not gulping for production use)
      // .pipe(gulpif(!argv.production, sourcemaps.init()))

      // Minify files (if gulping for production use)
      .pipe(gulpif(argv.production, uglify()))

      // // Write sourcemaps (if not gulping for production use)
      // .pipe(gulpif(!argv.production, sourcemaps.write()))

      .pipe(gulp.dest(destination));

  });

   gulp.task('concat:js', ['compile:js'], function () {

     if (!config.concat) return;

     for (var destinationFilename in config.concat) {

       // set source to be files to concatenate
       gulp.src(config.concat[destinationFilename])

        .pipe(plumber(onError))

        // Concatenate given files into a file
        .pipe(concat({ path: destinationFilename + '.js'}))

        // Minify files if gulping for production use
        .pipe(gulpif(argv.production, uglify()))

        .pipe(gulp.dest(destination));

     }

     return;

   });

 /**
  * Concatenate multiple files into one file.
  */
  gulp.task('minify:js', ['concat:js'], function () {

    if (!config.minify) return;

    return gulp.src(config.minify.src)

      .pipe(plumber(onError))

      // Minify files if gulping for production use
      .pipe(gulpif(argv.production, uglify()))

      .pipe(gulp.dest(destination));

  });

  gulp.task('default:js', ['hint:js', 'minify:js']);

  return gulp.tasks;

};
