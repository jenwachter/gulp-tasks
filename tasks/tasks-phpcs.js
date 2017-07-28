var gulp = require("gulp");
var phpcs = require("gulp-phpcs");

module.exports = function (config) {

  config = config || {};

  gulp.task("default:phpsc", function () {

    return gulp.src(config.src)
      .pipe(phpcs(config.options))
      .pipe(phpcs.reporter("log"));
  });

  return gulp.tasks;

};
