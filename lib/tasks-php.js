var gulp = require("gulp");
var notify = require("gulp-notify");
var phpunit = require("gulp-phpunit");
var argv = require("minimist")(process.argv.slice(2));
var paths = require("./paths");

var tasks = function (config) {
  this.config = config;
};

tasks.prototype.get = function () {

  gulp.task("phpunit", function() {
    gulp.src(paths.php.test).pipe(phpunit())
    .on("error", function (error) {
      // make errors return 0 so watch task doesn't exit.
      this.emit("end");
    });
  });

  gulp.task("watch", ["phpunit"], function () {
    gulp.watch(paths.php.watch, ["phpunit"]);
  });

  return gulp.tasks;

};

module.exports = tasks;
