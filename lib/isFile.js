var fs;

fs = require('fs');

module.exports = function(viewPath, callback) {
  return fs.exists(viewPath, function(exists) {
    if (!exists) {
      return callback(null, false);
    }
    return fs.stat(viewPath, function(err, stats) {
      if (err) {
        return callback(err);
      }
      return callback(null, stats.isFile());
    });
  });
};
