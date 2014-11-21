var gulp = require("gulp");
var notify = require("gulp-notify");
var argv = require("minimist")(process.argv.slice(2));
var gulpif = require("gulp-if");
var rename = require("gulp-rename");
var rimraf = require("gulp-rimraf");
var Rsync = require("rsync");
var fs = require("fs");
var mkdirp = require('mkdirp');
var paths = require("./paths");

var tasks = function (config) {
  this.config = config;
};

tasks.prototype.get = function () {

  var destination = argv.production || argv.staging ? paths.fonts.dist : paths.fonts.build;

  gulp.task("rsync:fonts", function () {

    // make sure destination exists, otherwise rsync will not work
    var exists = fs.existsSync(destination);
    if (!exists) mkdirp.sync(destination);

    var rsync = new Rsync()
      .flags("r")
      .source(paths.fonts.rsync.src)
      .progress()
      .destination(destination);

      rsync.execute();

  });

  gulp.task("watch", ["rsync:fonts"], function () {
    gulp.watch(paths.fonts.watch, ["rsync:fonts"]);
  });

  return gulp.tasks;
  
};

module.exports = tasks;
