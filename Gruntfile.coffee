module.exports = (grunt) ->

  grunt.initConfig

    clean:
      lib: ["lib"]

    coffee:
      server:
        expand: true
        cwd:'src'
        src: ['**/*.coffee']
        dest: 'lib'
        ext: '.js'
        options:
          bare:true

  grunt.loadNpmTasks "grunt-contrib-clean"
  grunt.loadNpmTasks "grunt-contrib-coffee"

  grunt.registerTask "default", ["clean", "coffee"]
