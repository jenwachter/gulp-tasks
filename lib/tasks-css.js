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

module.exports = function () {

  gulp.task("remove:css", function () {
    return gulp.src("./dist/css")
      .pipe(rimraf());
  })

  gulp.task("compile:css", ["remove:css"], function () {

    return gulp.src(["./src/css/*.scss"])

        .pipe(gulpif(argv.production, rename(rev)))

        .pipe(sass({ 
          sourcemap: !argv.production 
        }))

        .pipe(gulpif(function (file) {

          return !argv.production && path.extname(file.path) !== ".map";

        }, csslint("./config/csslintrc.json")))

        .pipe(csslint.reporter())

        // minify at some point but gulp-minify-css did not work :(
        //

        .pipe(gulp.dest("./dist/css"));

  });

  gulp.task("watch", ["compile:css"], function () {
    gulp.watch(["./src/css/**/*.scss", "!./src/css/vendor/**/*.scss"], ["compile:css"]);
  });

  return gulp.tasks;

};