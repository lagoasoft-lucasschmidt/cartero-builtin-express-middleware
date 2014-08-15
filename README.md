# cartero-builtin-express-middleware

See [cartero-express-middleware](https://github.com/rotundasoftware/cartero-express-middleware)

This is a cartero middleware that actually creates a ``cartero`` instance and starts the process for each of your views (parcels).

This means that you dont need to manually start cartero, and it means as well that only the pages you are working at that moment will have a **processing delay**.

This was done to improve build performance in the development phase. In theory, it can be used in production, if you trust the code, you could update parcels/code and it would automatically refresh your code if you activated the ``watch`` option in ``cartero``.

# Options
- cache
  + boolean that indicates if you want to store your parcels cached
  + Should match ``carteroOptions.watch`` option.
- outputDirUrl
  + this is the context path url required to access the output dir. If your cartero results are in ./public/assets, this should then be */assets* (if your public is matched to / in your app).
- outputDirPath
  + the actual path to the output directory
- carteroOptions
  + options to be given to cartero, based on ``cartero api``. See [cartero](https://github.com/rotundasoftware/cartero)

# Install

``npm install cartero-builtin-express-middleware --save``

# Example

```
...
app = express()
...
pkg = require '../../package.json'
app.use require('cartero-builtin-express-middleware')
  cache: app.settings.env isnt "development"
  outputDirUrl : assetsContextPath
  outputDirPath: assetsDir
  carteroOptions:
    watch: true
    appTransforms: ["browserify-plain-jade", "coffeeify", "browserify-shim", "less-css-stream"]
    appTransformDirs:[process.cwd()]
    sourceMaps: false
    packageTransform: (pkgJson, pkgPath)->
      pkgJson["browserify-shim"] = pkg["browserify-shim"] if pkg["browserify-shim"]
      return pkgJson
...
```

# Problems
- If you try to open the same page at the same time, if cartero did not init for that page, it may init multiple times.
