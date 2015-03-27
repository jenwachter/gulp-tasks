var gulp = require("gulp");
var argv = require("minimist")(process.argv.slice(2));
var jshint = require("gulp-jshint");
var stylish = require("jshint-stylish");
var gulpif = require("gulp-if");
var browserify = require("gulp-browserify");
var rimraf = require("gulp-rimraf");
var uglify = require("gulp-uglify");
var concat = require("gulp-concat");


module.exports = function (config) {

  config = config || {};
  var destination = argv.production || argv.staging ? config.dist : config.build;

  /**
   * Remove previously compiled files
   * in preparation for newly compiled files.
   *
   */
  gulp.task("remove:js", function () {

    return gulp.src(destination)
      .pipe(rimraf());

  });

  /**
   * Compile JavaScript files
   */
  gulp.task("compile:js", ["remove:js"], function () {

    if (!config.compile.src) return;

    return gulp.src(config.compile.src)

      // Run through jshint if there is a jshintrc file
      .pipe(gulpif(function (file) {
          return config.jshintrc;
        }, jshint(config.jshintrc))
      )
      .pipe(jshint.reporter("jshint-stylish"))

      // Compile files using browserify and optional transforms passed through configuration
      .pipe(browserify({
        debug: !argv.production,
        transform: config.compile.transform || []
      }))

      // Minify files if gulping for production use
      .pipe(gulpif(argv.production, uglify()))

      .pipe(gulp.dest(destination));

  });

  /**
   * Concatenate multiple files into one file.
   */
  gulp.task("concat:js", ["compile:js"], function () {

    if (!config.concat) return;

    for (var destinationFilename in config.concat) {

      // set source to be files to concatenate
      gulp.src(config.concat[destinationFilename])

        // Concatenate given files into a file
        .pipe(concat({ path: destinationFilename + ".js"}))

        // Minify files if gulping for production use
        .pipe(gulpif(argv.production, uglify()))

        .pipe(gulp.dest(destination));

    }

    return;

  });


  /**
   * Move vendor files
   */
  gulp.task("move:vendorjs", ["compile:js"], function () {

    if (!config.vendor) return;

    return gulp.src(config.vendor)

      // Minify files if gulping for production use
      .pipe(gulpif(argv.production, uglify()))

      .pipe(gulp.dest(destination));

  });

  gulp.task("default:js", ["compile:js", "concat:js", "move:vendorjs"]);

  return gulp.tasks;

};
