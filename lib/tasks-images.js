var gulp = require("gulp");
var argv = require("minimist")(process.argv.slice(2));
var Rsync = require("rsync");
var fs = require("fs");
var mkdirp = require('mkdirp');

module.exports = function (config) {

  config = config || {};
  var destination = argv.production || argv.staging ? config.dist : config.build;

  /**
   * Moves images from one location to another
   */
  gulp.task("rsync:images", function () {

    // make sure destination exists, otherwise rsync will not work
    var exists = fs.existsSync(destination);
    if (!exists) mkdirp.sync(destination);

    var rsync = new Rsync()
      .flags("r")
      .source(config.rsync)
      .progress()
      .destination(destination);

    rsync.execute();

  });

  gulp.task("default:images", ["rsync:images"]);

  return gulp.tasks;

};
