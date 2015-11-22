
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

       sass: {
           dev: {
               options: {
                  style: 'nested'
               },
               files: {
                   "build/css/client.css": "src/css/index.scss"
               }
           }
       },

       watch: {
           css: {
                files: ['src/css/**'],
                tasks: ['sass']
            },
            js: {
                files: ['src/js/**'],
                tasks: ['browserify']
            },
       },

       concurrent: {
           watch: ['watch:css', 'watch:js'],
           build: ['sass', 'browserify']
       }
   });

   grunt.registerTask('default', ['concurrent:build', 'concurrent:watch']);
}
