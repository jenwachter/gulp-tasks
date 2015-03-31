var argv = require("minimist")(process.argv.slice(2));

var Destination = function () {};

Destination.prototype.find = function (config) {

  return argv.production || argv.staging ? config.dist : config.build;

};

Destination.prototype.findFolder = function () {

  return argv.production || argv.staging ? "dist" : "build";

};

module.exports = new Destination();
