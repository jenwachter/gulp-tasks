var gulp = require("gulp");
var notify = require("gulp-notify");
var argv = require("minimist")(process.argv.slice(2));
var gulpif = require("gulp-if");
var rimraf = require("gulp-rimraf");
var Rsync = require("rsync");
var fs = require("fs");
var mkdirp = require('mkdirp');
var paths = require("./paths");

var tasks = function (config) {
  this.config = config;
  this.paths = this.config.images && this.config.images.paths ? this.config.images.paths : paths.images;
};

tasks.prototype.get = function () {

  var self = this;
  var destination = argv.production || argv.staging ? this.paths.dist : this.paths.build;

  gulp.task("rsync:images", function () {

    // make sure destination exists, otherwise rsync will not work
    var exists = fs.existsSync(destination);
    if (!exists) mkdirp.sync(destination);

    var rsync = new Rsync()
      .flags("r")
      .source(self.paths.rsync.src)
      .progress()
      .destination(destination);

      rsync.execute();

  });

  gulp.task("watch", ["rsync:images"], function () {
    gulp.watch(self.paths.watch, ["rsync:images"]);
  });

  return gulp.tasks;

};

module.exports = tasks;
