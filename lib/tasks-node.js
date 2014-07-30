var gulp = require("gulp");
var notify = require("gulp-notify");
var argv = require("minimist")(process.argv.slice(2));
var jshint = require("gulp-jshint");
var mocha = require("gulp-mocha");
var paths = require("./paths");

module.exports = function () {

  gulp.task("test:node", ["lint:node"], function () {
    gulp.src(paths.node.test)
      .pipe(mocha({reporter: "spec"}))
      .on("error", function (error) {
        // make errors return 0 so watch task doesn't exit.
        this.emit("end");
      });
  });

  gulp.task("lint:node", function () {

    console.log("lint!");

    return gulp.src(paths.node.build)
      .pipe(jshint())
      .pipe(jshint.reporter("jshint-stylish"));

  });

  gulp.task("watch", ["test:node"], function () {
    gulp.watch(paths.node.watch, ["test:node"]);
  });

  return gulp.tasks;

};
