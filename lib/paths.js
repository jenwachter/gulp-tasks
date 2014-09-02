module.exports = {

  js: {
    watch: ["./src/assets/js/**/*.js", "./src/assets/js/templates/**/*.html", "!./src/assets/js/vendor/**/*.js", "./test/**/*.js"],
    build: ["./src/assets/js/*.js"],
    vendor: ["./src/assets/js/vendor/*.js"],
    test: ["./test/**/*.js"],
    devDest: "./dist/js",
    prodDest: "./build/js"
  },

  node: {
    watch: ["./index.js", "./lib/**/*.js", "./test/**/*.js"],
    build: ["./index.js", "./lib/**/*.js"],
    test: ["./test/**/*.js"]
  },

  css: {
    watch: ["./src/assets/css/**/*.scss", "!./src/assets/css/vendor/**/*.scss"],
    build: ["./src/assets/css/*.scss"],
    devDest: "./dist/css",
    prodDest: "./build/css"
  },

  images: {
    watch: ["./src/assets/images/**/*"],
    build: ["./src/assets/images/**/*"],
    dest: "./dist/images"
  },

  php: {
    watch: ["./src/**/*.php", "./tests/**/*.php", "./test/**/*.php"],
    test: ["./tests/**/*Test.php", "./test/**/*Test.php"]
  }

};
