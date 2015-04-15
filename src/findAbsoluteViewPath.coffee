path = require 'path'
isFile = require './isFile'

module.exports = ()->
  cache = {}
  return (viewName, app, callback)->
    if cache[viewName] then return callback null, cache[viewName]
    else findAbsoluteViewPath viewName, app, (err, viewPath)->
      if err then return callback err
      cache[viewName] = viewPath
      callback null, viewPath

findAbsoluteViewPath = (viewName, app, callback) ->

  viewPath = path.resolve(app.get("views"), viewName)
  isFile viewPath, (err, result)->
    if err then return callback err
    else if result then return callback null, viewPath

    # if that doesn't work, resolve it using same method as app.render, which adds
    # extensions based on the view engine being used, etc.
    ext = path.extname(viewName)
    defaultEngine = app.get("view engine")
    if not ext and not defaultEngine
      return callback new Error("No default engine was specified and no extension was provided.")

    viewName += (ext = ((if "." isnt defaultEngine[0] then "." else "")) + defaultEngine)  unless ext

    # <path>.<engine>
    viewPath = path.resolve(app.get("views"), viewName)

    isFile viewPath, (err, result)->
      if err then return callback err
      else if result then return callback null, viewPath

      # <path>/index.<engine>
      viewPath = path.join(path.dirname(viewPath), path.basename(viewPath, ext), "index" + ext)
      isFile viewPath, (err, result)->
        if err then return callback err
        else if result then return callback null, viewPath
