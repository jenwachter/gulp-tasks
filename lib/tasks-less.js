var gulp = require("gulp");
var gulpif = require("gulp-if");
var notify = require("gulp-notify");
var less = require("gulp-less");
var csslint = require("gulp-csslint");
var rimraf = require("gulp-rimraf");
var path = require("path");
var argv = require("minimist")(process.argv.slice(2));
var paths = require("./paths");
var minify = require('gulp-minify-css');

var tasks = function (config) {
  this.config = config;
  this.paths = this.config.css && this.config.css.paths ? this.config.css.paths : paths.css;
};

tasks.prototype.get = function () {

  var self = this;

  var destination = argv.production || argv.staging ? this.paths.dist : this.paths.build;

  gulp.task("remove:css", function () {
    return gulp.src(destination)
      .pipe(rimraf());
  })

  gulp.task("compile:css", function () {

    return gulp.src(self.paths.src)

        .pipe(less())

        .pipe(gulpif(argv.production, minify({
          keepSpecialComments: 0
        })))

        .pipe(gulp.dest(destination));

  });

  gulp.task("default", ["remove:css", "compile:css"]);

  gulp.task("watch", ["default"], function () {
    gulp.watch(self.paths.watch, ["remove:css", "compile:css"]);
  });

  return gulp.tasks;

};

module.exports = tasks;
