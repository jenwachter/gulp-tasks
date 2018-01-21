var gulp = require('gulp');

var rimraf = require('rimraf');
var _ = require('underscore');

var Destination = require('../lib/destination');

module.exports = function (config) {

  config = config || [];
  var destinationFolder = Destination.findFolder();

  /**
   * Moves files from one location to another
   */
  gulp.task('move', function () {

    _.each(config, function (move) {

      var destination = move[destinationFolder];

      rimraf(destination, function () {
        gulp.src(move.src)
          .pipe(gulp.dest(destination));
      });

    });

    return;

  });

  gulp.task('default:move', ['move']);

  return gulp.tasks;

};
