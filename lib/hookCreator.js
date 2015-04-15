var carteroHook, carteroHookCache, cp, createCarteroHook, mkdirp, path, urljoin, uuid, _;

path = require('path');

carteroHook = require('cartero-node-hook');

mkdirp = require('mkdirp');

cp = require('child_process');

uuid = require('node-uuid');

urljoin = require('url-join');

_ = require('lodash');

carteroHookCache = {};

createCarteroHook = function(parcelPath, givenHookOptions, callback) {
  var c, carteroOptions, hookOptions, outputDirPath, outputFolder, parcelsDir, _ref;
  hookOptions = _.cloneDeep(givenHookOptions);
  carteroOptions = (hookOptions != null ? hookOptions.carteroOptions : void 0) || {};
  parcelsDir = parcelPath;
  outputFolder = uuid.v1();
  outputDirPath = path.join(hookOptions.outputDirPath, outputFolder);
  mkdirp.sync(outputDirPath);
  c = cp.fork(path.resolve(__dirname, './cartero'), {
    cwd: process.cwd()
  });
  if (carteroOptions != null ? (_ref = carteroOptions.appTransforms) != null ? _ref.length : void 0 : void 0) {
    carteroOptions.appTransformDirs = carteroOptions.appTransformDirs || [];
    carteroOptions.appTransformDirs.push(parcelsDir);
  }
  c.send({
    carteroOptions: carteroOptions,
    parcelsDir: parcelsDir,
    outputDirPath: outputDirPath
  });
  return c.on("message", function(status) {
    var hook;
    if (status.error) {
      return callback(status.error);
    }
    hookOptions.outputDirUrl = hookOptions.outputDirUrl || "";
    hookOptions.outputDirUrl = urljoin(hookOptions.outputDirUrl, outputFolder);
    hookOptions;
    hook = carteroHook(outputDirPath, {
      cache: (hookOptions != null ? hookOptions.cache : void 0) || false,
      outputDirUrl: hookOptions.outputDirUrl
    });
    return callback(null, hook);
  });
};

module.exports = function() {
  var findAbsoluteViewPath;
  findAbsoluteViewPath = require('./findAbsoluteViewPath')();
  return function(viewName, app, hookOptions, callback) {
    return findAbsoluteViewPath(viewName, app, function(err, absoluteViewPath) {
      var parcelPath;
      if (err) {
        return callback(err);
      }
      parcelPath = path.resolve(absoluteViewPath, "..");
      if (carteroHookCache[parcelPath]) {
        return callback(null, carteroHookCache[parcelPath], parcelPath);
      } else {
        return createCarteroHook(parcelPath, hookOptions, function(error, c) {
          if (error) {
            return callback(error);
          }
          carteroHookCache[parcelPath] = c;
          return callback(null, c, parcelPath);
        });
      }
    });
  };
};
