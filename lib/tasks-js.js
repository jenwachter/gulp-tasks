var gulp = require("gulp");
var notify = require("gulp-notify");
var argv = require("minimist")(process.argv.slice(2));
var jshint = require("gulp-jshint");
var stylish = require("jshint-stylish");
var gulpif = require("gulp-if");
var rename = require("gulp-rename");
var browserify = require("gulp-browserify");
var rimraf = require("gulp-rimraf");
var uglify = require("gulp-uglify");
var mocha = require("gulp-mocha");
var underscorify = require("node-underscorify");
var paths = require("./paths");
var concat = require("gulp-concat");

var tasks = function (config) {
  this.config = config;
};

tasks.prototype.get = function () {

  var self = this;

  var destination = argv.production || argv.staging ? paths.js.dist : paths.js.build;

  gulp.task("remove:js", function () {

    return gulp.src(destination)
      .pipe(rimraf());

  });

  gulp.task("concat:js", function () {

    if (!self.config.js || !self.config.js.concat) return;

    for (var filename in self.config.js.concat) {

      gulp.src(self.config.js.concat[filename])
        .pipe(concat({ path: filename + ".js"}))
        .pipe(gulpif(argv.production, uglify()))
        .pipe(gulp.dest(destination))

    }

    return;

  });

  gulp.task("compile:js", ["remove:js"], function () {

    var templateTransform = underscorify.transform({
      extensions: ['html']
    });

    return gulp.src(paths.js.src)

      .pipe(gulpif(function (file) {
          return !argv.production;
        }, jshint("./config/jshintrc.json"))
      )

      .pipe(jshint.reporter("jshint-stylish"))

      .pipe(browserify({
        debug: !argv.production,
        transform: [templateTransform]
      }))

      .pipe(gulpif(argv.production, uglify()))

      .pipe(gulp.dest(destination));

  });


  /**
   * Move 3rd-party vendor JS files to dist
   * without attempting to compile or browserify
   *
   */
  gulp.task("move:vendorjs", ["remove:js"], function () {
    return gulp.src(paths.js.vendor)
      .pipe(gulpif(argv.production, uglify()))
      .pipe(gulp.dest(destination));
  });



  gulp.task("test:js", function () {
    gulp.src(paths.js.test)
      .pipe(mocha({reporter: "spec"}))
      .on("error", function (error) {
        // make errors return 0 so watch task doesn't exit.
        this.emit("end");
      });
  });

  gulp.task("default", ["compile:js", "concat:js", "move:vendorjs", "test:js"]);

  gulp.task("watch", ["default"], function () {
    gulp.watch(paths.js.watch, ["compile:js", "concat:js", "move:vendorjs", "test:js"]);
  });

  return gulp.tasks;

};

module.exports = tasks;
