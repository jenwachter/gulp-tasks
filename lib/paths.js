module.exports = {

  js: {
    watch: ["./src/assets/js/**/*.js", "./src/assets/js/templates/**/*.html", "!./src/assets/js/vendor/**/*.js", "./test/**/*.js"],
    src: ["./src/assets/js/*.js"],
    vendor: ["./src/assets/js/vendor/*.js"],
    test: ["./test/**/*.js"],
    build: "./build/js",
    dist: "./dist/js"
  },

  node: {
    watch: ["./index.js", "./lib/**/*.js", "./test/**/*.js"],
    src: ["./index.js", "./lib/**/*.js"],
    test: ["./test/**/*.js"]
  },

  css: {
    watch: ["./src/assets/css/**/*.scss", "!./src/assets/css/vendor/**/*.scss"],
    src: ["./src/assets/css/*.scss"],
    build: "./build/css",
    dist: "./dist/css"
  },

  fonts: {
    watch: ["./src/assets/css/fonts/**/*"],
    src: ["./src/assets/css/fonts/**/*"],
    build: "./build/css/fonts",
    dist: "./dist/css/fonts",
    rsync: {
      src: "./src/assets/css/fonts/"
    }
  },

  images: {
    watch: ["./src/assets/images/**/*"],
    src: ["./src/assets/images/**/*"],
    build: "./build/images",
    dist: "./dist/images",
    rsync: {
      src: "./src/assets/images/"
    }
  },

  php: {
    watch: ["./src/**/*.php", "./tests/**/*.php", "./test/**/*.php"],
    test: ["./tests/**/*Test.php", "./test/**/*Test.php"]
  }

};
