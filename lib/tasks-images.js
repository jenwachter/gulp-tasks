var gulp = require("gulp");
var notify = require("gulp-notify");
var argv = require("minimist")(process.argv.slice(2));
var gulpif = require("gulp-if");
var rename = require("gulp-rename");
var rimraf = require("gulp-rimraf");
var rev = require("./rev");
var Rsync = require("rsync");
var fs = require("fs");
var mkdirp = require('mkdirp');
var paths = require("./paths");

module.exports = function () {

  var destination = argv.production || argv.staging ? paths.images.dist : paths.images.build;

  gulp.task("rsync:images", function () {

    // make sure destination exists, otherwise rsync will not work
    var exists = fs.existsSync(destination);
    if (!exists) mkdirp.sync(destination);

    var rsync = new Rsync()
      .flags("r")
      .source(paths.images.rsync.src)
      .progress()
      .destination(destination);

      rsync.execute();

  });

  gulp.task("watch", ["rsync:images"], function () {
    gulp.watch(paths.images.watch, ["rsync:images"]);
  });

  return gulp.tasks;
  
};
