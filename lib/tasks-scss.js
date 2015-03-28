var gulp = require("gulp");
var gulpif = require("gulp-if");
var sass = require("gulp-sass");
var csslint = require("gulp-csslint");
var rimraf = require("gulp-rimraf");
var argv = require("minimist")(process.argv.slice(2));
var minify = require('gulp-minify-css');

module.exports = function (config) {

  config = config || {};
  var destination = argv.production || argv.staging ? config.dist : config.build;

  gulp.task("remove:scss", function () {
    return gulp.src(destination)
      .pipe(rimraf());
  })
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

      // Run through sass compiler and create a source map if not gulping for production
      .pipe(sass({
        sourcemap: !argv.production
      }))


      // Minify files if gulping for production use
      .pipe(gulpif(argv.production, minify({
        keepSpecialComments: 0
      })))

      .pipe(gulp.dest(destination));

  });

  gulp.task("default:scss", ["lint:scss", "compile:scss"]);

  return gulp.tasks;

};
