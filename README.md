# gulp-tasks

A collection of common gulp tasks for website projects. Task collections include:

* __JavaScript tasks__
  * concatenate multiple source files into one file
  * compile source files that use the Node.js `require("module");` pattern
  * run jshint on files
  * minify files for production
* __SCSS tasks__
  * compile .scss source files into .css files
  * run csslint on files
  * minify files for production
* __LESS tasks__
  * compile .less source files into .css files
  * run csslint on files
  * minify files for production
* __Move task__
  * simply move files from a source directory into development and production folders. Use cases for this task include images and fonts.

## Install

Install gulp-tasks as a development dependency:

```bash
npm install git+ssh://git@github.com:jenwachter/gulp-tasks.git --save-dev
```

## Implementation

```javascript
var gulp = require("gulp");
var Tasker = require("gulp-tasks");

// configure Tasker
var gulpTasker = new Tasker(gulp, {

  js: {

    concat: {
      // resulting filename
      base: [

        // Array of files to concatenate
        "./src/js/bundle/one.js",
        "./src/js/bundle/two.js"
      ]
    },

    compile: {
      // A glob object that defines the files to compile
      src: ["./src/js/*.js"],

      // An array of transforms (see: http://bit.ly/1F4oex3)
      transform: []
    },

    hint: {
      // A glob object that defines the files to run through jshint
      src: ["./src/js/**/*.js"],

      // The location of the jshintrc.json file or an object with this configuration
      jshintrc: "./config/jshintrc.json"
    },

    // Location to put development build files
    build: "./build/js",

    // Location to put distribution build files
    dist: "./dist/js"
  },

  move: [
    {
      // A glob object that defines the files to move
      src:"./src/images/",

      // Location to put development build files
      build: "./build/images",

      // Location to put distribution build files
      dist: "./dist/images"
    }
  ],

  scss: {

    lint: {,
      // A glob object that defines the files to run through csslint
      src: ["./src/scss/*.scss"],

      // The location of the csslintrc.json file or an object with this configuration
      csslintrc: {}
    },

    // A glob object that defines the files to move
    src: ["./src/scss/*.scss"],

    // Location to put development build files
    build: "./build/scss",

    // Location to put distribution build files
    dist: "./dist/scss"
  }

});

// add tasks
gulp.tasks = gulpTasker
  .add("js")
  .add("move")
  .add("scss")
  .get();

// create default task
gulp.task("default", ["default:js", "default:move", "default:scss", "default:less"]);

// create watch task
gulp.task("watch", ["default"], function () {

  gulp.watch(["./src/js/**/*.js", "./src/js/templates/**/*.html"], ["default:js"]);
  gulp.watch(["./src/images/**/*"], ["default:move"]);
  gulp.watch(["./src/scss/**/*.scss"], ["default:scss"]);

});
```
