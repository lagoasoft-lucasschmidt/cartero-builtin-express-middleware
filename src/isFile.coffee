fs = require 'fs'

module.exports = (viewPath, callback)->
  fs.exists viewPath, (exists)->
    if not exists then return callback null, false
    fs.stat viewPath, (err, stats)->
      if err then return callback err
      callback null, stats.isFile()
