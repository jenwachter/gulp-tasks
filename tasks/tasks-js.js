var gulp = require("gulp");
var _ = require("underscore");
var argv = require("minimist")(process.argv.slice(2));
var browserify = require("browserify");
var sourcemaps = require("gulp-sourcemaps");
var jshint = require("gulp-jshint");
var stylish = require("jshint-stylish");
var gulpif = require("gulp-if");
var del = require("del");
var uglify = require("gulp-uglify");
var concat = require("gulp-concat");
var through2 = require("through2");
var gutil = require("gulp-util");

var Destination = require("../lib/destination");


module.exports = function (config) {

  config = config || {};
  var destination = Destination.find(config);

  /**
   * Remove previously compiled files
   * in preparation for newly compiled files.
   *
   */
  gulp.task("remove:js", function (cb) {

    del(destination, cb);

  });

  /**
   * Run files through jshint if a jshintrc
   * file is specified in the config.
   */
  gulp.task("hint:js", function () {

    if (!config.hint.src) return;

    var hintconfig = config.hint.jshintrc || {};

    return gulp.src(config.hint.src)

      .pipe(jshint(hintconfig))
      .pipe(jshint.reporter("jshint-stylish"));

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
  gulp.task("compile:js", ["remove:js"], function () {

    if (!config.compile.src) return;

    var transforms = config.compile.transform || [];

    return gulp.src(config.compile.src)

      .pipe(through2.obj(function (file, enc, next) {

        var b = browserify(file.path, { debug: !argv.production });

        _.each(transforms, function (transform) {
          b.transform(transform);
        });

        b.bundle(function (err, res) {

          if (err) {

            new gutil.log("Browserify Error", gutil.colors.red.bold(err.message));
            this.emit("end");

          } else {

            file.contents = res;
            next(null, file);

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

   gulp.task("concat:js", ["compile:js"], function () {

     if (!config.concat) return;

     for (var destinationFilename in config.concat) {

       // set source to be files to concatenate
       gulp.src(config.concat[destinationFilename])

         // Concatenate given files into a file
         .pipe(concat({ path: destinationFilename + ".js"}))

         // Minify files if gulping for production use
         .pipe(gulpif(argv.production, uglify()))

         .pipe(gulp.dest(destination));

     }

     return;

   });

 /**
  * Concatenate multiple files into one file.
  */
  gulp.task("minify:js", ["concat:js"], function () {

    if (!config.minify) return;

    return gulp.src(config.minify.src)

      // Minify files if gulping for production use
      .pipe(gulpif(argv.production, uglify()))

      .pipe(gulp.dest(destination));

  });

  gulp.task("default:js", ["hint:js", "minify:js"]);

  return gulp.tasks;

};
