var gulp = require("gulp");
var gulpif = require("gulp-if");
var sass = require("gulp-ruby-sass");
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

  gulp.task("compile:scss", ["remove:scss"], function () {

    return gulp.src(config.src)

      // Create a source map if not gulping for production
      .pipe(sass({
        sourcemap: !argv.production
      }))

      // Run through csslin if there is a csslinrc file
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

  gulp.task("default:scss", ["compile:scss"]);

  return gulp.tasks;

};
