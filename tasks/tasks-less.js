var gulp = require("gulp");
var gulpif = require("gulp-if");
var less = require("gulp-less");
var csslint = require("gulp-csslint");
var sourcemaps = require("gulp-sourcemaps");
var rimraf = require("gulp-rimraf");
var argv = require("minimist")(process.argv.slice(2));
var minify = require("gulp-minify-css");

var Destination = require("../lib/destination");

module.exports = function (config) {

  config = config || {};
  var destination = Destination.find(config);
  
  gulp.task("remove:less", function () {
    return gulp.src(destination)
      .pipe(rimraf());
  });

  /**
   * Run files through csslint if a csslintrc
   * file is specified in the config.
   */
  gulp.task("lint:less", function () {

    if (!config.lint.src) return;

    var lintconfig = config.lint.csslintrc || {};

    return gulp.src(config.lint.src)

      .pipe(csslint(lintconfig))
      .pipe(csslint.reporter());

  });

  gulp.task("compile:less", ["remove:less"], function () {

    return gulp.src(config.src)

      // Init sourcemaps (if not gulping for production use)
      .pipe(gulpif(!argv.production, sourcemaps.init()))

      // Run through less compiler
      .pipe(less())

      // Write sourcemaps (if not gulping for production use)
      .pipe(gulpif(!argv.production, sourcemaps.write()))

      // Minify files if gulping for production use
      .pipe(gulpif(argv.production, minify({
        keepSpecialComments: 0
      })))

      .pipe(gulp.dest(destination));

  });

  gulp.task("default:less", ["lint:less", "compile:less"]);

  return gulp.tasks;

};