

const _ = require('underscore');

const taskTypes = {
  js: require('./tasks/tasks-js'),
  scss: require('./tasks/tasks-scss'),
  move: require('./tasks/tasks-move'),
  phpcs: require('./tasks/tasks-phpcs')
};

/**
 * Tasker constructor
 * @param {obejct} gulpInstannce Instance of gulp
 */
const Tasker = function (gulpInstannce) {

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
  let taskConfig = this.config[taskType];
  let moreTasks = taskTypes[taskType](taskConfig);

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
  let taskConfig = this.config[taskType];
  let moreTasks = task(taskConfig);

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
