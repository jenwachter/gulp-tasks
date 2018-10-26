const gulp = require('gulp'),
  rimraf = require('rimraf'),
  _ = require('underscore');

const Destination = require('../lib/destination');

module.exports = function (config) {

  config = config || [];
  let destinationFolder = Destination.findFolder();

  /**
   * Moves files from one location to another
   */
  gulp.task('move', function () {

    _.each(config, function (move) {

      let destination = move[destinationFolder];

      rimraf(destination, function () {
        gulp.src(move.src)
          .pipe(gulp.dest(destination));
      });

    });

  });

  gulp.task('default:move', ['move']);

  return gulp.tasks;

};
