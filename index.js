var gulp = require("gulp");
var _ = require("underscore");
var argv = require("minimist")(process.argv.slice(2));

var tasks = {
  php: require("./lib/tasks-php"),
  js: require("./lib/tasks-js"),
  css: require("./lib/tasks-css"),
  images: require("./lib/tasks-images"),
  release: require("./lib/tasks-release")
};

var taskTypes = function () {};

taskTypes.prototype.php = function () {
  return _.extend(tasks.php(), tasks.release());
};

taskTypes.prototype.js = function () {
  return _.extend(tasks.js(), tasks.release());
};

taskTypes.prototype.css = function () {
  return _.extend(tasks.css(), tasks.release());
};

taskTypes.prototype.images = function () {
  return _.extend(tasks.images(), tasks.release());
};

taskTypes.prototype.wptheme = function () {
  var tasks = _.extend(tasks.js(), tasks.css(), tasks.php());

  tasks.watch = function () {

    // update js
    // update css
    // run php tests

  };

};

taskTypes.prototype.release = function () {
  return tasks.release();
};

module.exports = new taskTypes();
