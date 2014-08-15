path = require 'path'
# try to find the absolute path of the template by resolving it against the views folder
module.exports = populateResDefault = (parcelPath, hook, res, cb) ->
  hook.getParcelTags parcelPath, (err, scriptTags, styleTags) ->
    if err
      console.log "Could not find or load parcel at " + parcelPath
      return cb() # parcel probably does not exist. not a bid deal
    res.locals.cartero_js = scriptTags
    res.locals.cartero_css = styleTags
    res.locals.cartero_url = (filePath) ->
      filePath = path.resolve(parcelPath, filePath)
      hook.getAssetUrl filePath

    cb()

