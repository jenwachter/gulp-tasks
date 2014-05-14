# gulp-tasks

A collection of gulp tasks for various types of projects.

## Install

Install both gulp and gulp-tasks as development dependencies

```bash
npm install gulp git+ssh://git@github.com:johnshopkins/gulp-tasks.git --save-dev
```

## Implementation

Implementation in projects:

```javascript
// require gulp
var gulp = require("gulp");

// assign gulp.tasks to the appropiate project
gulp.tasks = require("gulp-tasks").php();

// add or override existing tasks
gulp.task("anotherTask", function () {
  // do stuff
});
```

## Project types and what they do

### PHP

```javascript
gulp.tasks = require("gulp-tasks").php();
```

Tasks assume file structure created by [johnshopkins/generator-composer](https://github.com/johnshopkins/generator-composer).

#### Tasks it creates

__gulp watch__: Watches for changes to PHP files in the `/src` and `/tests` directories for changes and runs `phpunit` task when changes are made.

__gulp phpunit__: Runs `phpunit` in the root of your project. Make sure you have a phpunit.xml set up in the root that describes your test suite.


### WordPress Plugin

```javascript
gulp.tasks = require("gulp-tasks").wpplugin();
```

Tasks assume file structure created by [johnshopkins/generator-wp-plugin](https://github.com/johnshopkins/generator-wp-plugin).

#### Tasks it creates

__gulp watch__: Watches for changes to certain types of files. When there are changes...

- JavaScript: scripts are compiled to `dist/js`. If a JavaScript library you are creating needs unit tests, it should be created as a separate Node package.
- CSS: SCSS is compiled to `dist/css`.
- Images: images are moved to `dist/images`.
- PHP: unit tests are run.

__gulp build__: Runs the tasks that `gulp watch` runs, except that it only runs it once. Handy for making a release build.


### WordPress Theme

```javascript
gulp.tasks = require("gulp-tasks").wptheme();
```

_Yeoman generator to come. For now, look to [machado theme](https://github.com/johnshopkins/machado) for an example of file structure._

#### Tasks it creates

__gulp watch__: Watches for changes to certain types of files. When there are changes...

- JavaScript: scripts are compiled to `dist/js`. If a JavaScript library you are creating needs unit tests, it should be created as a separate Node package.
- CSS: SCSS is compiled to `dist/css`.
- Images: images are moved to `dist/images`.
- PHP: Controllers and partials are copied to the root, where WordPress expects them. As of now, unit tests are not part of this task.

__gulp build__: Runs the tasks that `gulp watch` runs, except that it only runs it once. Handy for making a release build.
