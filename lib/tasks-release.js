var gulp = require("gulp");
var argv = require("minimist")(process.argv.slice(2));
var release = require("./releaser");


var tasks = function (config) {
  this.config = config;
};

tasks.prototype.get = function () {

  gulp.task("release:create", function (done) {

    if (argv.type === "hotfix") argv.type = "patch";

    if (!argv.type || ['major', 'minor', 'patch'].indexOf(argv.type) < 0) {
      return done("Please pass a release type via --type={major|minor|patch}");
    }

    release.create(argv.type, {
      files: ["./composer.json"]
    }, function (error) {
      done(error);
      if (error) process.exit(1);
    });

  });


  gulp.task("release", ["release:create"], function (done) {
    release.push(function (error) {
      done(error);
      if (error) process.exit(1);
    });
  });

  return gulp.tasks;

};

module.exports = tasks;
