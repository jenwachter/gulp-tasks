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
  this.paths = this.config.fonts && this.config.fonts.paths ? this.config.fonts.paths : paths.fonts;
};

tasks.prototype.get = function () {

  var self = this;

  var destination = argv.production || argv.staging ? this.paths.dist : this.paths.build;
  var source = this.paths.rsync && this.paths.rsync.src ? this.paths.rsync.src : this.src;

  gulp.task("rsync:fonts", function () {

    // make sure destination exists, otherwise rsync will not work
    var exists = fs.existsSync(destination);
    if (!exists) mkdirp.sync(destination);

    var rsync = new Rsync()
      .flags("r")
      .source(source)
      .progress()
      .destination(destination);

      rsync.execute();

  });

  gulp.task("watch", ["rsync:fonts"], function () {
    gulp.watch(self.paths.watch, ["rsync:fonts"]);
  });

  return gulp.tasks;

};

module.exports = tasks;
