var gulp = require("gulp");
var _ = require("underscore");
var argv = require("minimist")(process.argv.slice(2));
var paths = require("./lib/paths");

var getTask = {
  php: require("./lib/tasks-php"),
  js: require("./lib/tasks-js"),
  css: require("./lib/tasks-css"),
  images: require("./lib/tasks-images"),
  wptheme: require("./lib/tasks-wptheme"),
  release: require("./lib/tasks-release")
};

var taskTypes = function () {};

taskTypes.prototype.php = function () {
  return _.extend(getTask.php(), getTask.release());
};

taskTypes.prototype.js = function () {
  return _.extend(getTask.js(), getTask.release());
};

taskTypes.prototype.css = function () {
  return _.extend(getTask.css(), getTask.release());
};

taskTypes.prototype.images = function () {
  return _.extend(getTask.images(), getTask.release());
};

taskTypes.prototype.wptheme = function () {
  
  gulp.tasks = _.extend(getTask.js(), getTask.css(), getTask.images(), getTask.release());

  gulp.task("watch", ["compile:js", "compile:css", "move:images", "compile:themefiles"], function () {
    gulp.watch(paths.js.watch, ["compile:js"]);
    gulp.watch(paths.css.watch, ["compile:css"]);
    gulp.watch(paths.images.watch, ["move:images"]);
    gulp.watch(["./src/controllers/*.php", "./src/partials/*.php", "!./src/partials/_*.php"], ["compile:themefiles"]);
  });

  return gulp.tasks;

};

taskTypes.prototype.wpplugin = function () {

  gulp.tasks = _.extend(getTask.js(), getTask.css(), getTask.images(), getTask.php(), getTask.release());

  gulp.task("watch", ["compile:js", "compile:css", "move:images"], function () {
    gulp.watch(paths.js.watch, ["compile:js"]);
    gulp.watch(paths.css.watch, ["compile:css"]);
    gulp.watch(paths.images.watch, ["move:images"]);
    gulp.watch(paths.php.watch, ["phpunit"]);
  });

  return gulp.tasks;

};

taskTypes.prototype.release = function () {
  return getTask.release();
}

module.exports = new taskTypes();
