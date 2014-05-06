var exec    = require("child_process").exec;
var async   = require("async");
var gulp    = require("gulp");
var Bumper  = require("./bumper");


function getCurrentBranch(callback) {

  exec("git branch | grep '*'", function (error, stdout, stderr) {
    if (error) return callback(error);
    callback(null, stdout.replace(/[\*\s]*/, "").trim());
  });

}


function checkRepo(callback) {

  exec("git status -s", function (error, stdout, stderr) {

    if (error) return callback(error);

    if (stdout) {
      return callback(new Error("Please commit all changes before deploying."))
    }

    callback();

  });

}


function pullMaster(callback) {

  async.waterfall([
    function (cb) {
      exec("git fetch", function (error, stdout, stderr) {
        cb(error);
      });
    },
    function (cb) {
      exec("git merge --no-ff origin/master", function (error, stdout, stderr) {
        cb(error);
      });
    }
  ], function (error) {

    callback(error);

  });

}



/**
 * Merge to master, push to origin, delete old branches
 * 
 * @param  {object}   options  optional opts hash
 * @param  {Function} callback
 * @return 
 */
function push(options, callback) {
  
  options = options || {};

  // Allow for func(callback) signature
  if (!callback && typeof options === "function") {
    callback = options;
    options = {};
  }

  async.waterfall([

    function (cb) {

      // workBranch passed to callback here
      getCurrentBranch(cb);

    },
    function (workBranch, cb) {

      checkRepo(function (err) {
        cb(err, workBranch);
      });

    },
    function (workBranch, cb) {

      exec("git checkout master", function (error, stdout, stderr) {
        cb(error, workBranch);
      });

    },
    function (workBranch, cb) {

      exec("git merge --no-ff " + workBranch, function (error, stdout, stderr) {
        cb(error, workBranch);
      });

    },
    function (workBranch, cb) {

      exec("git push --tags origin master", function (error, stdout, stderr) {
        cb(error, workBranch);
      });

    },
    function (workBranch, cb) {

      if (options.keepWorkBranch) {
        return cb(null, workBranch);
      }

      exec("git branch -d " + workBranch, function (error, stdout, stderr) {
        cb(error, workBranch);
      });

    },
    function (workBranch, cb) {

      if (options.keepWorkBranch) {
        return cb();
      }

      exec("git push origin :" + workBranch, function (error, stdout, stderr) {
        cb(); // ignore errors
      });

    }

  ], function (error) {

    // Run user-passed callback here
    callback(error);

  });

}



/**
 * Bump all necessary files, then use npm version
 * to bump package.json and create git commit/tag.
 *   
 * @param  {string}   type     (major|minor|patch)
 * @param  {array}    files    list of files to manually bump, must be JSON with version key
 * @param  {Function} callback 
 * @return null
 */
function create(type, options, callback) {

  var b = new Bumper({
    type: type,
    files: options.files,
    dest: "./"
  });

  async.waterfall([
    checkRepo, 
    pullMaster, 
    b.bumpfiles.bind(b), 
    b.commitfile.bind(b), 
    b.npmversion.bind(b)
  ], function (error) {

    callback(error);

  });

}

module.exports.push = push;
module.exports.create = create;