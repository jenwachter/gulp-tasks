var _ = require("underscore");

var taskTypes = {
  js: require("./tasks/tasks-js"),
  scss: require("./tasks/tasks-scss"),
  less: require("./tasks/tasks-less"),
  move: require("./tasks/tasks-move")
};

/**
 * Tasker constructor
 * @param {obejct} gulpInstannce Instance of gulp
 */
var Tasker = function (gulpInstannce) {

  this.gulpInstannce = gulpInstannce;
  this.config = {};

};

/**
 * Set task configuration
 * @param {obejct} config        Configuration
 */
Tasker.prototype.setConfig = function (config) {

  this.config = config;
  return this;

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
 * Add a custom gulp task
 * @param {string} taskType Task type (aids in config lookup)
 */
Tasker.prototype.addCustom = function (taskType, task) {

  // get more tasks
  var taskConfig = this.config[taskType];
  var moreTasks = task(taskConfig);

  this.gulpInstannce.tasks = _.extend(this.gulpInstannce.tasks, moreTasks);

  return this;

};

/**
 * Retrieve gulp tasks
 */
Tasker.prototype.get = function () {

  return this.gulpInstannce.tasks;

};

module.exports = Tasker;
