var gulp = require("gulp");
var notify = require("gulp-notify");
var rimraf = require("gulp-rimraf");
var argv = require("minimist")(process.argv.slice(2));

module.exports = function () {

  gulp.task("remove:themefiles", function () {
    return gulp.src("./*.php")
      .pipe(rimraf());
  });

  gulp.task("compile:themefiles", ["remove:themefiles"], function () {
    
    return gulp.src(["./src/theme/controllers/*.php", "./src/theme/partials/*.php", "!./src/theme/partials/_*.php"])
      .pipe(gulp.dest("./"));

  });

  gulp.task("watch", ["compile:themefiles"], function () {
    gulp.watch(["./src/theme/controllers/*.php", "./src/theme/partials/*.php", !"./src/theme/partials/_*.php"], ["compile:themefiles"]);
  });

  return gulp.tasks;

};
