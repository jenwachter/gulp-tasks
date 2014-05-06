var gulp = require("gulp");
var notify = require("gulp-notify");
var argv = require("minimist")(process.argv.slice(2));
var gulpif = require("gulp-if");
var rename = require("gulp-rename");
var rimraf = require("gulp-rimraf");
var rev = require("./rev");

module.exports = function () {

  gulp.task("remove:images", function () {

    return gulp.src("./dist/images")
      .pipe(rimraf());

  });

  gulp.task("move:images", ["remove:images"], function () {

    return gulp.src("./src/images/**/*")
      .pipe(gulpif(argv.production, rename(rev)))
      .pipe(gulp.dest("./dist/images"));

  });

  gulp.task("watch", ["move:images"], function () {
    gulp.watch(["./src/images/**/*"], ["move:images"]);
  });

  return gulp.tasks;
  
};