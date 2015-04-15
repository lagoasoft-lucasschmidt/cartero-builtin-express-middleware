fs = require("fs")
path = require("path")

module.exports = (hookOptions, opts) ->

  # for each request, wrap the render function so that we can execute our own code
  # first to populate the `cartero_js`, `cartero_css`

  populateRes = require('./populateResDefault')  if typeof (opts?.populateRes) isnt "function"
  hookCreator = require('./hookCreator')()

  return (req, res, next) ->
    oldRender = res.render
    app = req.app
    res.render = (viewName, options, cb) ->
      hookCreator viewName, app, hookOptions, (err, hook, parcelPath)->
        if err then return next(err)
        populateRes parcelPath, hook, res, (err) ->
          if err then return next(err)
          oldRender.call res, viewName, options, cb

    next()
