var gulp = require("gulp");
var _ = require("underscore");
var argv = require("minimist")(process.argv.slice(2));

var tasks = {
  php: require("./lib/tasks-php"),
  release: require("./lib/tasks-release")
};

var taskTypes = function () {};

taskTypes.prototype.php = function () {
  return _.extend(tasks.php(), tasks.release());
};

taskTypes.prototype.release = function () {
  return tasks.release();
};

module.exports = new taskTypes();
