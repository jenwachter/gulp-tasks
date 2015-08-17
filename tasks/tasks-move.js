var gulp = require("gulp");

var fs = require("fs");
var mkdirp = require("mkdirp");
var _ = require("underscore");

var Destination = require("../lib/destination");

module.exports = function (config) {

  config = config || [];
  var destinationFolder = Destination.findFolder();

  /**
   * Moves files from one location to another
   */
  gulp.task("move", function () {

    _.each(config, function (move) {

      var destination = move[destinationFolder];

      var exists = fs.existsSync(destination);
      if (!exists) mkdirp.sync(destination);

      gulp.src(move.src)
        .pipe(gulp.dest(destination));

    });

    return;

  });

  gulp.task("default:move", ["move"]);

  return gulp.tasks;

};
