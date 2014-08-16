cartero = require("cartero")

process.on "message", (options)->
  carteroOptions = options?.carteroOptions or {}
  parcelsDir = options?.parcelsDir
  outputDirPath = options?.outputDirPath

  if carteroOptions.packageTransform?.length
    carteroOptions.packageTransform = require carteroOptions.packageTransform

  c = cartero(parcelsDir, outputDirPath, carteroOptions)
  c.on "done", ->
    process.send status: "OK"

  c.on "error", (err) ->
    process.send
      status: "ERROR"
      error: err


