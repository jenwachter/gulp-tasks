var gulp = require("gulp");
var _ = require("underscore");
var argv = require("minimist")(process.argv.slice(2));
var Rsync = require("rsync");
var fs = require("fs");
var mkdirp = require('mkdirp');

module.exports = function (config) {

  config = config || [];
  var destinationFolder = argv.production || argv.staging ? "dist" : "build";

  /**
   * Moves files from one location to another
   */
  gulp.task("move", function () {

    _.each(config, function (move) {

      var destination = move[destinationFolder];

      var exists = fs.existsSync(destination);
      if (!exists) mkdirp.sync(destination);

      var rsync = new Rsync()
        .flags("r")
        .source(move.src)
        .progress()
        .destination(destination);

      rsync.execute();

    });

    return;

  });

  gulp.task("default:move", ["move"]);

  return gulp.tasks;

};
