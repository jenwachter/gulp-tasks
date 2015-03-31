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
Tasker.prototype.get = function () {

  return this.gulpInstannce.tasks;

};

module.exports = Tasker;
