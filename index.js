var gulp = require("gulp");
var _ = require("underscore");
var argv = require("minimist")(process.argv.slice(2));
var paths = require("./lib/paths");

var taskTypes = {
  php: require("./lib/tasks-php"),
  js: require("./lib/tasks-js"),
  css: require("./lib/tasks-css"),
  node: require("./lib/tasks-node"),
  images: require("./lib/tasks-images"),
  wptheme: require("./lib/tasks-wptheme"),
  release: require("./lib/tasks-release"),
  fonts: require("./lib/tasks-fonts")
};

var config = {};

var gulpTaskCreator = function () {
  this.paths = paths;
};

gulpTaskCreator.prototype.setConfig = function (config) {
  config = config;
};


function getTask (type) {

  var tasks = new taskTypes[type](config);
  return tasks.get();

}

gulpTaskCreator.prototype.php = function () {
  return _.extend(getTask("php"), getTask("release"));
};

gulpTaskCreator.prototype.js = function () {
  return _.extend(getTask("js"), getTask("release"));
};

gulpTaskCreator.prototype.css = function () {
  return _.extend(getTask("css"), getTask("fonts"), getTask("release"));
};

gulpTaskCreator.prototype.images = function () {
  return _.extend(getTask("images"), getTask("release"));
};

gulpTaskCreator.prototype.nodeapp = function () {
  return _.extend(getTask("node"), getTask("release"));
};

gulpTaskCreator.prototype.jsapp = function () {

  gulp.tasks = _.extend(getTask("js"), getTask("css"), getTask("images"), getTask("fonts"), getTask("release"));

  gulp.task("watch", ["compile:js", "compile:css", "rsync:images", "rsync:fonts"], function () {
    gulp.watch(paths.js.watch, ["compile:js"]);
    gulp.watch(paths.css.watch, ["compile:css"]);
    gulp.watch(paths.images.watch, ["rsync:images"]);
    gulp.watch(paths.fonts.watch, ["rsync:fonts"]);
  });

  return gulp.tasks;

};

gulpTaskCreator.prototype.wptheme = function () {

  gulp.tasks = _.extend(getTask("js"), getTask("css"), getTask("images"), getTask("fonts"), getTask("wptheme"), getTask("php"), getTask("release"));

  gulp.task("default", ["compile:js", "move:vendorjs", "compile:css", "rsync:images", "rsync:fonts", "phpunit", "compile:themefiles"]);

  gulp.task("watch", ["default"], function () {
    gulp.watch(paths.js.watch, ["compile:js", "move:vendorjs"]);
    gulp.watch(paths.css.watch, ["compile:css"]);
    gulp.watch(paths.images.watch, ["rsync:images"]);
    gulp.watch(paths.fonts.watch, ["rsync:fonts"]);
    gulp.watch(paths.php.watch, ["phpunit"]);
    gulp.watch(["./src/theme/controllers/*.php", "./src/theme/functions.php"], ["compile:themefiles"]);
  });

  return gulp.tasks;

};

gulpTaskCreator.prototype.wpplugin = function () {

  gulp.tasks = _.extend(getTask("js"), getTask("css"), getTask("images"), getTask("fonts"), getTask("php"), getTask("release"));

  gulp.task("default", ["compile:js", "move:vendorjs", "compile:css", "rsync:images", "rsync:fonts", "phpunit"]);

  gulp.task("watch", ["default"], function () {
    gulp.watch(paths.js.watch, ["compile:js", "move:vendorjs"]);
    gulp.watch(paths.css.watch, ["compile:css"]);
    gulp.watch(paths.images.watch, ["rsync:images"]);
    gulp.watch(paths.fonts.watch, ["rsync:fonts"]);
    gulp.watch(paths.php.watch, ["phpunit"]);
  });

  return gulp.tasks;

};

gulpTaskCreator.prototype.release = function () {
  return getTask("release");
}

module.exports = new gulpTaskCreator();
