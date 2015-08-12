var gulp = require("gulp");
var gulpif = require("gulp-if");
var sass = require("gulp-sass");
var csslint = require("gulp-csslint");
var sourcemaps = require("gulp-sourcemaps");
var rimraf = require("gulp-rimraf");
var argv = require("minimist")(process.argv.slice(2));
var minify = require("gulp-minify-css");

var Destination = require("../lib/destination");

module.exports = function (config) {

  config = config || {};
  var destination = Destination.find(config);

  gulp.task("remove:scss", function () {
    return gulp.src(destination)
      .pipe(rimraf());
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

    return gulp.src(config.src)

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
      .pipe(mqRemove(config.ieBreakpoint))
      .pipe(gulp.dest(config.destination + "/ie"));

  });

  gulp.task("default:scss", ["lint:scss", "compile:scss"]);

  return gulp.tasks;

};
