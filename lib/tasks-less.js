var gulp = require("gulp");
var gulpif = require("gulp-if");
var less = require("gulp-less");
var csslint = require("gulp-csslint");
var rimraf = require("gulp-rimraf");
var argv = require("minimist")(process.argv.slice(2));
var minify = require('gulp-minify-css');

module.exports = function (config) {

  config = config || {};
  var destination = argv.production || argv.staging ? config.dist : config.build;

  gulp.task("remove:less", function () {
    return gulp.src(destination)
      .pipe(rimraf());
  });

  gulp.task("compile:less", ["remove:less"], function () {

    return gulp.src(config.src)

      // Run through less compiler
      .pipe(less())

      // Run through csslint if there is a csslinrc file
      .pipe(gulpif(function (file) {
        return config.csslintrc;
      }, csslint(config.csslintrc)))
      .pipe(csslint.reporter())

      // Minify files if gulping for production use
      .pipe(gulpif(argv.production, minify({
        keepSpecialComments: 0
      })))

      .pipe(gulp.dest(destination));

  });

  gulp.task("default:less", ["compile:less"]);

  return gulp.tasks;

};
