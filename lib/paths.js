module.exports = {

  js: {
    watch: ["./src/assets/js/**/*.js", "!./src/assets/js/vendor/**/*.js", "./test/**/*.js"],
    build: ["./src/assets/js/*.js"],
    test: ["./test/**/*.js"],
    dest: "./dist/js"
  },

  css: {
    watch: ["./src/assets/css/**/*.scss", "!./src/assets/css/vendor/**/*.scss"],
    build: ["./src/assets/css/*.scss"],
    dest: "./dist/css"
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
