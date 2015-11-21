
module.exports = function(grunt) {

    require('load-grunt-tasks')(grunt);

    grunt.initConfig({

        browserify: {
           dev: {
               files: {
                   "build/js/client.js": ["src/js/client.js"]
               },
               options: {
                   transform: [
                       ["babelify", {
                           optional: [
                               'es7.classProperties',
                               'es7.decorators'
                           ],
                           sourceMaps: "both"
                       }]
                   ]
               }
           }
       },
    })
}
