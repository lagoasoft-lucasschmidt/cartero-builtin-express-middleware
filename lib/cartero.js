var cartero;

cartero = require("cartero");

process.on("message", function(options) {
  var c, carteroOptions, outputDirPath, parcelsDir;
  carteroOptions = (options != null ? options.carteroOptions : void 0) || {};
  parcelsDir = options != null ? options.parcelsDir : void 0;
  outputDirPath = options != null ? options.outputDirPath : void 0;
  c = cartero(parcelsDir, outputDirPath, carteroOptions);
  c.on("done", function() {
    return process.send({
      status: "OK"
    });
  });
  return c.on("error", function(err) {
    return process.send({
      status: "ERROR",
      error: err
    });
  });
});
