var gulp = require("gulp");
var exec = require("child_process").exec;
var bump = require("gulp-bump");

var Bumper = function (options) {
  this.options = options || {};
};

// Bumper.prototype.isPHP = function (callback) {
//   exec("ls -la | grep composer.json", function (error, stdout, stderr) {
//     if (error) return callback(error);
//     if (stdout.trim() !== "") return callback(new Error("No composer.json file"));
//     callback();
//   });
// }

Bumper.prototype.bumpfiles = function (callback) {
  gulp.src(this.options.files)
    .pipe(bump({ type: this.options.type }))
    .pipe(gulp.dest(this.options.dest))
    .on("end", callback);
};

Bumper.prototype.commitfile = function (callback) {
  var message = "composer.json file bumped"
  exec("git add ./composer.json && git commit -m '" + message + "'", function (error, stdout, stderr) {
    callback(error);
  });
};

Bumper.prototype.npmversion = function (callback) {
  exec("npm version " + this.options.type, function (error, stdout, stderr) {
    if (error) return callback(error);
    console.log("Bumped package.json version and tag " + stdout.trim() + " created.");
    callback();
  });
};

module.exports = Bumper;