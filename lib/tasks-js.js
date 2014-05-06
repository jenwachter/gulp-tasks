var gulp = require("gulp");
var notify = require("gulp-notify");
var argv = require("minimist")(process.argv.slice(2));
var jshint = require("gulp-jshint");
var stylish = require("jshint-stylish");
var gulpif = require("gulp-if");
var rename = require("gulp-rename");
var browserify = require("gulp-browserify");
var rimraf = require("gulp-rimraf");
var uglify = require("gulp-uglify");
var rev = require("./rev");

module.exports = function () {

  gulp.task("remove:js", function () {

    return gulp.src("./dist/js")
      .pipe(rimraf());

  });

  gulp.task("compile:js", ["remove:js"], function () {
    
    return gulp.src(["./src/js/*.js"])

      .pipe(gulpif(argv.production, rename(rev)))

      .pipe(gulpif(function (file) {

          return !argv.production;

        }, jshint("./config/jshintrc.json"))
      )

      .pipe(jshint.reporter("jshint-stylish"))

      .pipe(browserify({
        debug: !argv.production
      }))

      .pipe(gulpif(argv.production, uglify({ outSourceMap: true })))

      .pipe(gulp.dest("./dist/js"));

  });

  gulp.task("watch", ["compile:js"], function () {
    gulp.watch(["./src/js/**/*.js", "!./src/js/vendor/**/*.js"], ["compile:js"]);
  });

  return gulp.tasks;

};