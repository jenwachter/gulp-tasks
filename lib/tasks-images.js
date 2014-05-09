var gulp = require("gulp");
var notify = require("gulp-notify");
var argv = require("minimist")(process.argv.slice(2));
var gulpif = require("gulp-if");
var rename = require("gulp-rename");
var rimraf = require("gulp-rimraf");
var rev = require("./rev");
var paths = require("./paths");

module.exports = function () {

  gulp.task("remove:images", function () {

    return gulp.src(paths.images.dest)
      .pipe(rimraf());

  });

  gulp.task("move:images", ["remove:images"], function () {

    return gulp.src(paths.images.build)
      .pipe(gulpif(argv.production, rename(rev)))
      .pipe(gulp.dest(paths.images.dest));

  });

  gulp.task("watch", ["move:images"], function () {
    gulp.watch(paths.images.watch, ["move:images"]);
  });

  return gulp.tasks;
  
};
