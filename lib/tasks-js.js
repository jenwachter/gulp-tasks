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
var rev = require("./rev");
var paths = require("./paths");

module.exports = function () {

  gulp.task("remove:js", function () {

    return gulp.src(paths.js.dest)
      .pipe(rimraf());

  });

  gulp.task("compile:js", ["remove:js"], function () {

    var templateTransform = underscorify.transform({
      extensions: ['html']
    });

    return gulp.src(paths.js.build)

      // .pipe(gulpif(argv.production, rename(rev)))

      .pipe(gulpif(function (file) {

          return !argv.production;

        }, jshint("./config/jshintrc.json"))
      )

      .pipe(jshint.reporter("jshint-stylish"))

      .pipe(browserify({
        debug: !argv.production,
        transform: [templateTransform]
      }))

      .pipe(gulpif(argv.production, uglify({ outSourceMap: true })))

      .pipe(gulp.dest(paths.js.dest));

  });


  /**
   * Move 3rd-party vendor JS files to dist
   * without attempting to compile or browserify
   *
   */
  gulp.task("move:vendorjs", ["remove:js"], function () {
    return gulp.src(paths.js.vendor)
      .pipe(gulpif(argv.production, uglify()))
      .pipe(gulp.dest(paths.js.dest));
  });



  gulp.task("test:js", function () {
    gulp.src(paths.js.test)
      .pipe(mocha({reporter: "spec"}))
      .on("error", function (error) {
        // make errors return 0 so watch task doesn't exit.
        this.emit("end");
      });
  });

  gulp.task("watch", ["compile:js", "move:vendorjs", "test:js"], function () {
    gulp.watch(paths.js.watch, ["compile:js", "move:vendorjs", "test:js"]);
  });

  return gulp.tasks;

};
