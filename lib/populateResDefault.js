var path, populateResDefault;

path = require('path');

module.exports = populateResDefault = function(parcelPath, hook, res, cb) {
  return hook.getParcelTags(parcelPath, function(err, scriptTags, styleTags) {
    if (err) {
      console.log("Could not find or load parcel at " + parcelPath);
      return cb();
    }
    res.locals.cartero_js = scriptTags;
    res.locals.cartero_css = styleTags;
    res.locals.cartero_url = function(filePath) {
      filePath = path.resolve(parcelPath, filePath);
      return hook.getAssetUrl(filePath);
    };
    return cb();
  });
};
