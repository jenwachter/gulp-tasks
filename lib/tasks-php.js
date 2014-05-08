var gulp = require("gulp");
var notify = require("gulp-notify");
var phpunit = require("gulp-phpunit");
var argv = require("minimist")(process.argv.slice(2));

module.exports = function () {

  gulp.task("phpunit", function() {
    gulp.src(["./tests/**/*Test.php"]).pipe(phpunit())
    .on("error", function (error) {
      // make errors return 0 so watch task doesn't exit.
      this.emit("end");
    });
  });

  gulp.task("watch", ["phpunit"], function () {
    gulp.watch(["./src/**/*.php", "./tests/**/*.php"], ["phpunit"]);
  });

  return gulp.tasks;

};
