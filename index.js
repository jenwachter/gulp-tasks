var _ = require("underscore");

var taskTypes = {
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

/**
 * Tasker constructor
 * @param {obejct} gulpInstannce Instance of gulp
 * @param {obejct} config        Configuration
 */
var Tasker = function (gulpInstannce, config) {

  this.gulpInstannce = gulpInstannce;
  this.config = config || {};

};

/**
 * Add a set of tasks to the instance of gulp
 * @param {string} taskType Task type
 */
Tasker.prototype.add = function (taskType) {

  // get more tasks
  var taskConfig = this.config[taskType];
  var moreTasks = taskTypes[taskType](taskConfig);

  // add tasks to gulp instance
  this.gulpInstannce.tasks = _.extend(this.gulpInstannce.tasks, moreTasks);

  // return Tasker object to enable chaining
  return this;

};

/**
 * Retrieve gulp tasks
 */
Tasker.prototype.getTasks = function () {

  return this.gulpInstannce.tasks;

};

module.exports = Tasker;
