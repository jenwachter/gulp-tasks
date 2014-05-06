var gulp = require("gulp");
var phpunit = require("gulp-phpunit");
var _ = require("underscore");
var argv = require("minimist")(process.argv.slice(2));
var release = require("./lib/releaser");


var tasks = function () {};

tasks.prototype.php = function () {

  gulp.task("phpunit", function() {
    gulp.src(["./tests/**/*Test.php"]).pipe(phpunit());
  });

  gulp.task("watch", function () {
    gulp.watch(["./src/**/*.php", "./tests/**/*.php"], ["phpunit"]);
  });

  return _.extend(gulp.tasks, this.release());

};

tasks.prototype.release = function () {

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

module.exports = new tasks();
