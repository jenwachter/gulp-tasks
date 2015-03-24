var gulp = require("gulp");
var notify = require("gulp-notify");
var argv = require("minimist")(process.argv.slice(2));
var jshint = require("gulp-jshint");
var mocha = require("gulp-mocha");
var paths = require("./paths");

var tasks = function (config) {
  this.config = config;
  this.paths = this.config.node && this.config.node.paths ? this.config.node.paths : paths.node;
};

tasks.prototype.get = function () {

  var self = this;

  gulp.task("test:node", ["lint:node"], function () {
    gulp.src(self.paths.test)
      .pipe(mocha({reporter: "spec"}))
      .on("error", function (error) {
        // make errors return 0 so watch task doesn't exit.
        this.emit("end");
      });
  });

  gulp.task("lint:node", function () {

    return gulp.src(self.paths.src)
      .pipe(jshint())
      .pipe(jshint.reporter("jshint-stylish"));

  });

  gulp.task("watch", ["test:node"], function () {
    gulp.watch(self.paths.watch, ["test:node"]);
  });

  return gulp.tasks;

};

module.exports = tasks;
