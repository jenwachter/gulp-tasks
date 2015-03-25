var gulp = require("gulp");
var argv = require("minimist")(process.argv.slice(2));
var jshint = require("gulp-jshint");
var stylish = require("jshint-stylish");
var gulpif = require("gulp-if");
var browserify = require("gulp-browserify");
var rimraf = require("gulp-rimraf");
var uglify = require("gulp-uglify");
var mocha = require("gulp-mocha");
var concat = require("gulp-concat");

var tasks = function (config) {

  this.config = config.js || {};
  this.destination = argv.production || argv.staging ? this.config.dist : this.config.build;

};

tasks.prototype.get = function () {

  var self = this;

  /**
   * Remove previously compiled files
   * in preparation for newly compiled files.
   *
   */
  gulp.task("remove:js", function () {

    return gulp.src(self.destination)
      .pipe(rimraf());

  });

  /**
   * Concatenate multiple files into one file.
   */
  gulp.task("concat:js", function () {

    if (!self.config.concat) return;

    for (var filename in self.config.concat) {

      gulp.src(self.config.concat[filename])
        .pipe(concat({ path: filename + ".js"}))
        .pipe(gulpif(argv.production, uglify()))
        .pipe(gulp.dest(self.destination));

    }

    return;

  });

  /**
   * Compile JavaScript files using Browserify
   */
  gulp.task("compile:js", function () {

    if (!self.config.compile.src) return;

    return gulp.src(self.config.compile.src)

      .pipe(gulpif(function (file) {
          return !argv.production && self.config.jshintrc;
        }, jshint(self.config.jshintrc))
      )
      .pipe(jshint.reporter("jshint-stylish"))

      .pipe(browserify({
        debug: !argv.production,
        transform: self.config.compile.transform || []
      }))

      .pipe(gulpif(argv.production, uglify()))

      .pipe(gulp.dest(self.destination));

  });


  /**
   * Move vendor files
   */
  gulp.task("move:vendorjs", function () {

    if (!self.config.vendor) return;

    return gulp.src(self.config.vendor)
      .pipe(gulpif(argv.production, uglify()))
      .pipe(gulp.dest(self.destination));
  });

  /**
   * Run JavaScript tests
   */
  gulp.task("test:js", function () {

    if (!self.config.test) return;

    gulp.src(self.config.test)
      .pipe(mocha({reporter: "spec"}))
      .on("error", function (error) {
        // make errors return 0 so watch task doesn't exit.
        this.emit("end");
      });

  });

  gulp.task("default", ["remove:js", "compile:js", "concat:js", "move:vendorjs", "test:js"]);

  gulp.task("watch", ["default"], function () {
    gulp.watch(self.config.watch, ["remove:js", "compile:js", "concat:js", "move:vendorjs", "test:js"]);
  });

  return gulp.tasks;

};

module.exports = tasks;
