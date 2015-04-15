var findAbsoluteViewPath, isFile, path;

path = require('path');

isFile = require('./isFile');

module.exports = function() {
  var cache;
  cache = {};
  return function(viewName, app, callback) {
    if (cache[viewName]) {
      return callback(null, cache[viewName]);
    } else {
      return findAbsoluteViewPath(viewName, app, function(err, viewPath) {
        if (err) {
          return callback(err);
        }
        cache[viewName] = viewPath;
        return callback(null, viewPath);
      });
    }
  };
};

findAbsoluteViewPath = function(viewName, app, callback) {
  var viewPath;
  viewPath = path.resolve(app.get("views"), viewName);
  return isFile(viewPath, function(err, result) {
    var defaultEngine, ext;
    if (err) {
      return callback(err);
    } else if (result) {
      return callback(null, viewPath);
    }
    ext = path.extname(viewName);
    defaultEngine = app.get("view engine");
    if (!ext && !defaultEngine) {
      return callback(new Error("No default engine was specified and no extension was provided."));
    }
    if (!ext) {
      viewName += (ext = ("." !== defaultEngine[0] ? "." : "") + defaultEngine);
    }
    viewPath = path.resolve(app.get("views"), viewName);
    return isFile(viewPath, function(err, result) {
      if (err) {
        return callback(err);
      } else if (result) {
        return callback(null, viewPath);
      }
      viewPath = path.join(path.dirname(viewPath), path.basename(viewPath, ext), "index" + ext);
      return isFile(viewPath, function(err, result) {
        if (err) {
          return callback(err);
        } else if (result) {
          return callback(null, viewPath);
        }
      });
    });
  });
};
