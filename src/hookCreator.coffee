path = require 'path'
carteroHook = require 'cartero-node-hook'
mkdirp = require 'mkdirp'
cp = require 'child_process'
uuid = require 'node-uuid'
urljoin = require 'url-join'
_ = require 'lodash'

carteroHookCache = {}

createCarteroHook = (parcelPath, givenHookOptions, callback)->
  hookOptions = _.cloneDeep givenHookOptions
  carteroOptions = hookOptions?.carteroOptions or {}
  parcelsDir = parcelPath

  outputFolder = uuid.v1()
  outputDirPath = path.join hookOptions.outputDirPath, outputFolder

  mkdirp.sync(outputDirPath)

  c = cp.fork path.resolve(__dirname, './cartero'), {cwd: process.cwd()}

  if carteroOptions?.appTransforms?.length
    carteroOptions.appTransformDirs = carteroOptions.appTransformDirs or []
    carteroOptions.appTransformDirs.push parcelsDir

  c.send
    carteroOptions: carteroOptions
    parcelsDir: parcelsDir
    outputDirPath: outputDirPath

  c.on "message", (status)->
    if status.error then return callback status.error
    hookOptions.outputDirUrl = hookOptions.outputDirUrl or ""
    hookOptions.outputDirUrl = urljoin hookOptions.outputDirUrl, outputFolder
    hookOptions
    hook = carteroHook outputDirPath,
      cache: hookOptions?.cache or false
      outputDirUrl: hookOptions.outputDirUrl
    callback null, hook

module.exports = ()->
  findAbsoluteViewPath = require('./findAbsoluteViewPath')()

  return (viewName, app, hookOptions, callback)->
    findAbsoluteViewPath viewName, app, (err, absoluteViewPath)->
      if err then return callback err
      parcelPath = path.resolve(absoluteViewPath, "..")

      if carteroHookCache[parcelPath]
        callback null, carteroHookCache[parcelPath], parcelPath
      else
        createCarteroHook parcelPath, hookOptions, (error, c)->
          if error then return callback(error)
          carteroHookCache[parcelPath] = c
          callback null, c, parcelPath
