var gulp = require("gulp");
var _ = require("underscore");
var argv = require("minimist")(process.argv.slice(2));
var paths = require("./lib/paths");

var tasks = {
  php: require("./lib/tasks-php"),
  js: require("./lib/tasks-js"),
  css: require("./lib/tasks-css"),
  less: require("./lib/tasks-less"),
  node: require("./lib/tasks-node"),
  images: require("./lib/tasks-images"),
  wptheme: require("./lib/tasks-wptheme"),
  release: require("./lib/tasks-release"),
  fonts: require("./lib/tasks-fonts")
};

var Tasker = function () {
  this.paths = paths;
  this.config = {};
  this.tasks = tasks;
};

Tasker.prototype.setConfig = function (config) {
  if (config) this.config = config;
};


Tasker.prototype.getTask = function (type) {

  var tasks = new this.tasks[type](this.config);
  return tasks.get();

};

Tasker.prototype.php = function () {
  return _.extend(this.getTask("php"), this.getTask("release"));
};

Tasker.prototype.js = function () {

  gulp.tasks = _.extend(this.getTask("js"), this.getTask("release"));
  gulp.task("default", ["compile:js", "concat:js", "move:vendorjs", "test:js"]);

  return gulp.tasks;

};

Tasker.prototype.css = function () {
  return _.extend(this.getTask("css"), this.getTask("fonts"), this.getTask("release"));
};

Tasker.prototype.less = function () {
  return _.extend(this.getTask("less"), this.getTask("fonts"), this.getTask("release"));
};

Tasker.prototype.images = function () {
  return _.extend(this.getTask("images"), this.getTask("release"));
};

Tasker.prototype.nodeapp = function () {
  return _.extend(this.getTask("node"), this.getTask("release"));
};

Tasker.prototype.jsapp = function () {

  gulp.tasks = _.extend(this.getTask("js"), this.getTask("css"), this.getTask("images"), this.getTask("fonts"), this.getTask("release"));

  gulp.task("default", ["compile:js", "concat:js", "move:vendorjs", "compile:css", "rsync:images", "rsync:fonts"]);

  gulp.task("watch", ["default"], function () {
    gulp.watch(paths.js.watch, ["compile:js", "concat:js", "move:vendorjs"]);
    gulp.watch(paths.css.watch, ["compile:css"]);
    gulp.watch(paths.images.watch, ["rsync:images"]);
    gulp.watch(paths.fonts.watch, ["rsync:fonts"]);
  });

  return gulp.tasks;

};

Tasker.prototype.wptheme = function () {

  gulp.tasks = _.extend(this.getTask("js"), this.getTask("css"), this.getTask("images"), this.getTask("fonts"), this.getTask("wptheme"), this.getTask("php"), this.getTask("release"));
  gulp.task("default", ["compile:js", "concat:js", "move:vendorjs", "compile:css", "rsync:images", "rsync:fonts", "phpunit", "compile:themefiles"]);

  gulp.task("watch", ["default"], function () {
    gulp.watch(paths.js.watch, ["compile:js", "concat:js", "move:vendorjs"]);
    gulp.watch(paths.css.watch, ["compile:css"]);
    gulp.watch(paths.images.watch, ["rsync:images"]);
    gulp.watch(paths.fonts.watch, ["rsync:fonts"]);
    gulp.watch(paths.php.watch, ["phpunit"]);
    gulp.watch(["./src/theme/controllers/*.php", "./src/theme/functions.php"], ["compile:themefiles"]);
  });

  return gulp.tasks;

};

Tasker.prototype.wpplugin = function () {

  gulp.tasks = _.extend(this.getTask("js"), this.getTask("css"), this.getTask("images"), this.getTask("fonts"), this.getTask("php"), this.getTask("release"));

  gulp.task("default", ["compile:js", "concat:js", "move:vendorjs", "compile:css", "rsync:images", "rsync:fonts", "phpunit"]);

  gulp.task("watch", ["default"], function () {
    gulp.watch(paths.js.watch, ["compile:js", "concat:js", "move:vendorjs"]);
    gulp.watch(paths.css.watch, ["compile:css"]);
    gulp.watch(paths.images.watch, ["rsync:images"]);
    gulp.watch(paths.fonts.watch, ["rsync:fonts"]);
    gulp.watch(paths.php.watch, ["phpunit"]);
  });

  return gulp.tasks;

};

Tasker.prototype.release = function () {
  return this.getTask("release");
}

module.exports = new Tasker();
