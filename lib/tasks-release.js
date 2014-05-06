var gulp = require("gulp");
var _ = require("underscore");
var argv = require("minimist")(process.argv.slice(2));
var release = require("./lib/releaser");


module.exports = function () {

  gulp.task("release:create", function (done) {

    if (argv.type === "hotfix") argv.type = "patch";
    
    if (!argv.type || ['major', 'minor', 'patch'].indexOf(argv.type) < 0) {
      return done("Please pass a release type via --type={major|minor|patch}");
    }

    release.create(argv.type, { 
      files: ["./composer.json"] 
    }, done);

  });


  gulp.task("release", ["release:create"], function (done) {

    release.push(done);

  });

  return gulp.tasks;

};