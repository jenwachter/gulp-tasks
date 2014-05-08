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
var mocha = require("gulp-mocha");
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

  gulp.task("test:js", function () {
    gulp.src(["./test/**/*.js"])
      .pipe(mocha({reporter: "spec"}))
      .on("error", function (error) {
        // make errors return 0 so watch task doesn't exit.
        this.emit("end");
      });
  });

  gulp.task("watch", ["compile:js", "test:js"], function () {
    gulp.watch(["./src/js/**/*.js", "!./src/js/vendor/**/*.js", "./test/**/*.js"], ["compile:js"]);
  });

  return gulp.tasks;

};
