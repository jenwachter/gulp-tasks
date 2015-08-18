var gulp = require("gulp");
var plumber = require("gulp-plumber");

var argv = require("minimist")(process.argv.slice(2));
var csslint = require("gulp-csslint");
var del = require("del");
var gulpif = require("gulp-if");
var minify = require("gulp-minify-css");
var mqRemove = require("gulp-mq-remove");
var sass = require("gulp-sass");
var sourcemaps = require("gulp-sourcemaps");

var Destination = require("../lib/destination");
var onError = require("../lib/onError");

module.exports = function (config) {

  config = config || {};
  var destination = Destination.find(config);

  gulp.task("remove:scss", function (cb) {

    del(destination, cb);

  });

  /**
   * Run files through csslint if a csslintrc
   * file is specified in the config.
   */
  gulp.task("lint:scss", function () {

    if (!config.lint.src) return;

    var lintconfig = config.lint.csslintrc || {};

    return gulp.src(config.lint.src)
      .pipe(csslint(lintconfig))
      .pipe(csslint.reporter());

  });

  gulp.task("compile:scss", ["remove:scss"], function () {

    /**
     * If no breakpoint is specified, give it a fake one. If there isn't
     * a breakpoint specified, mqRemove errors out even though it
     * doesn't run. ¯\_(ツ)_/¯
     */
    var breakpoint = config.ieBreakpoint ? config.ieBreakpoint : { width: "100px" };

    return gulp.src(config.src)

      .pipe(plumber(onError))

      // Init sourcemaps (if not gulping for production use)
      .pipe(gulpif(!argv.production, sourcemaps.init()))

      // Run through sass compiler and create a source map if not gulping for production
      .pipe(sass())

      // Write sourcemaps (if not gulping for production use)
      .pipe(gulpif(!argv.production, sourcemaps.write()))

      // Minify files if gulping for production use
      .pipe(gulpif(argv.production, minify({
        keepSpecialComments: 0
      })))

      .pipe(gulp.dest(destination))

      // IE stylesheets
      .pipe(gulpif(config.ieBreakpoint, mqRemove(breakpoint)))
      .pipe(gulpif(config.ieBreakpoint, gulp.dest(destination + "/ie")));

  });

  gulp.task("default:scss", ["lint:scss", "compile:scss"]);

  return gulp.tasks;

};
