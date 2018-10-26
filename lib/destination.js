const argv = require('minimist')(process.argv.slice(2));

module.exports = {

  find: function (config) {
    return argv.production || argv.staging ? config.dist : config.build;
  },

  findFolder: function () {
    return argv.production || argv.staging ? 'dist' : 'build';
  }

};
