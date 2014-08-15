var fs, hookCreator, path;

fs = require("fs");

path = require("path");

hookCreator = require('./hookCreator');

module.exports = function(hookOptions, opts) {
  var populateRes;
  if (typeof (opts != null ? opts.populateRes : void 0) !== "function") {
    populateRes = require('./populateResDefault');
  }
  return function(req, res, next) {
    var app, oldRender;
    oldRender = res.render;
    app = req.app;
    res.render = function(viewName, options, cb) {
      return hookCreator(viewName, app, hookOptions, function(err, hook, parcelPath) {
        if (err) {
          return next(err);
        }
        return populateRes(parcelPath, hook, res, function(err) {
          if (err) {
            return next(err);
          }
          return oldRender.call(res, viewName, options, cb);
        });
      });
    };
    return next();
  };
};
