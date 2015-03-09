var gulp = require("gulp");
var notify = require("gulp-notify");
var phpunit = require("gulp-phpunit");
var argv = require("minimist")(process.argv.slice(2));
var paths = require("./paths");

var tasks = function (config) {
  this.config = config;
  this.paths = this.config.php.paths || paths.php;
};

tasks.prototype.get = function () {

  var self = this;

  gulp.task("phpunit", function() {
    gulp.src(self.paths.test).pipe(phpunit())
    .on("error", function (error) {
      // make errors return 0 so watch task doesn't exit.
      this.emit("end");
    });
  });

  gulp.task("watch", ["phpunit"], function () {
    gulp.watch(self.paths.watch, ["phpunit"]);
  });

  return gulp.tasks;

};

module.exports = tasks;
