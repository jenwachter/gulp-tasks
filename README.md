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

The implementation of gulp-tasks takes place in your project's `gulpfile.js`.

First, include gulp and gulp-tasks:

```javascript
var gulp = require("gulp");
var Tasker = require("gulp-tasks");
```

Then create and configure a gulp tasker:

```javascript
var gulpTasker = new Tasker(gulp);
gulpTasker.setConfig({

  js: {

    minify: {
      // A glob object that defines the files to minify
      src: ["./src/js/*.js"],
    },

    concat: {
      // resulting filename, sans .js
      base: [

        // Array of files to concatenate into base.js
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

    // A glob object that defines the files to compile
    src: ["./src/scss/*.scss"],

    // Location to put development build files
    build: "./build/css",

    // Location to put distribution build files
    dist: "./dist/css"
  }

});
```

Now add tasks to gulp:

```javascript
gulp.tasks = gulpTasker
  .add("js")
  .add("move")
  .add("scss")
  .get();
```

This will give you access to all the tasks created in `tasks/tasks-[type].js`. For example, each task type creates a `default:[type]` task, which we can use when we create gulp tasks for our project:

```javascript
// compile all files when running `gulp`
gulp.task("default", ["default:js", "default:move", "default:scss"]);

// after running `gulp watch`, compile all files and watch for changes
gulp.task("watch", ["default"], function () {
  gulp.watch(["./src/js/**/*.js"], ["default:js"]);
  gulp.watch(["./src/images/**/*"], ["default:move"]);
  gulp.watch(["./src/scss/**/*.scss"], ["default:scss"]);
});
```


## Build directories

In the configuration, a `build` and `dist` directory is specified for each task type. When developing a project, files are build into the `build` directory. When you are ready to deploy a project, files are built into the `dist` directory. Here's how you do that with gulp tasks:

```javascript
// build into `build` directory
gulp

// build into `build` directory on file changes
gulp watch

// build into `dist` directory
gulp --staging

// build into `dist` directory and minify files
gulp --production
```
