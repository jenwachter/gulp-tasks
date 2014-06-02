var gulp = require("gulp");

var gaze = require("gaze");
var debug = require("gulp-debug");
var path = require("path");
var changed = require("gulp-changed");
var fs = require("fs");

function move(files) {

  return gulp.src(files)
    .pipe(changed(paths.statics.dest))
    // .pipe(debug())
    .pipe(gulp.dest(paths.statics.dest));

}

function remove(file) {

  file = file.replace(path.resolve(paths.statics.directory), path.resolve(paths.statics.dest));

  console.log("Deleting static file: " + file);

  fs.unlink(file, function (err) {
    if (err) console.error(err);
  });

}

module.exports = function () {

  gulp.task("watch", function () {

    gaze(paths.statics.watch, function (err, watcher) {

      this.on("changed",  function () { move(paths.statics.watch); });
      this.on("added",    function () { move(paths.statics.watch); });
      this.on("deleted",  remove);

    });

  });

  return gulp.tasks;

};
