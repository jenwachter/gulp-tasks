var gulp = require("gulp");
var gulpif = require("gulp-if");
var notify = require("gulp-notify");
var sass = require("gulp-ruby-sass");
var csslint = require("gulp-csslint");
var rimraf = require("gulp-rimraf");
var rename = require("gulp-rename");
var path = require("path");
var argv = require("minimist")(process.argv.slice(2));
var rev = require("./rev");
var paths = require("./paths");
var minify = require('gulp-minify-css');

module.exports = function () {

  var destination = argv.production || argv.staging ? paths.css.dist : paths.css.build;

  gulp.task("remove:css", function () {
    return gulp.src(destination)
      .pipe(rimraf());
  })

  gulp.task("compile:css", ["remove:css"], function () {

    return gulp.src(paths.css.src)

        // .pipe(gulpif(argv.production, rename(rev)))

        .pipe(sass({ 
          sourcemap: !argv.production 
        }))

        // .pipe(gulpif(function (file) {

        //   return !argv.production && path.extname(file.path) !== ".map";

        // }, csslint("./config/csslintrc.json")))

        // .pipe(csslint.reporter())

        .pipe(gulpif(argv.production, minify({
          keepSpecialComments: 0
        })))

        .pipe(gulp.dest(destination));

  });

  gulp.task("watch", ["compile:css"], function () {
    gulp.watch(paths.css.watch, ["compile:css"]);
  });

  return gulp.tasks;

};
