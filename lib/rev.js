module.exports = function (path) {

  // don't rev us!
  if (path.file.stat.isDirectory()) return;
  if (path.extname == ".map") return;

  var file_contents = path.file._contents.toString();
  var hash = crypto.createHash("sha1").update(file_contents).digest("hex");
  path.basename = path.basename + "-" + hash;

};