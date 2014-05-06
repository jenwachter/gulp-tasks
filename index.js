var gulp = require("gulp");
var _ = require("underscore");
var argv = require("minimist")(process.argv.slice(2));

var getTask = {
  php: require("./lib/tasks-php"),
  js: require("./lib/tasks-js"),
  css: require("./lib/tasks-css"),
  images: require("./lib/tasks-images"),
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
  
  gulp.tasks = _.extend(getTask.js(), getTask.css(), getTask.images());

  gulp.task("watch", ["compile:js", "compile:css", "move:images"], function () {
    gulp.watch(["./src/js/**/*.js", "!./src/js/vendor/**/*.js"], ["compile:js"]);
    gulp.watch(["./src/css/**/*.scss", "!./src/css/vendor/**/*.scss"], ["compile:css"]);
    gulp.watch(["./src/images/**/*"], ["move:images"]);
  });

  return gulp.tasks;

};

taskTypes.prototype.wpplugin = function () {

  gulp.tasks = _.extend(getTask.js(), getTask.css(), getTask.images(), getTask.php());

  gulp.task("watch", ["compile:js", "compile:css", "move:images"], function () {
    gulp.watch(["./src/js/**/*.js", "!./src/js/vendor/**/*.js"], ["compile:js"]);
    gulp.watch(["./src/css/**/*.scss", "!./src/css/vendor/**/*.scss"], ["compile:css"]);
    gulp.watch(["./src/images/**/*"], ["move:images"]);
    gulp.watch(["./src/**/*.php", "./tests/**/*.php"], ["phpunit"]);
  });

  return gulp.tasks;

};

module.exports = new taskTypes();
