module.exports = function(grunt) {

    var packageJson = require('./package.json');
    var version = packageJson.version;
    console.log(version);

    var devStaticDir = '';
    var distStaticDir = 'https://resources.fantasybach.com/' + version;
    
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({

        clean : {
            build : [ 'build' ]
        },

        browserify : {
            dev : {
                files : {
                    'build/js/client.js' : [ 'src/js/client.js' ]
                },
                options : {
                    browserifyOptions : {
                        debug : true
                    },
                    transform : [
                        [ 'babelify', {
                            optional : [
                                'es7.classProperties',
                                'es7.decorators'
                            ],
                            sourceMaps : 'both'
                        }]
                    ],
                    watch : true,
                    keepAlive : true
                }
            },
            dist : {
                files : {
                    'build/js/client.js' : [ 'src/js/client.js' ]
                },
                options : {
                    transform : [
                        [ 'babelify', {
                            optional : [
                                'es7.classProperties',
                                'es7.decorators'
                            ]
                        }]
                    ]
                }
            }
        },

        sass : {
            options : {
                outputStyle : 'compressed'
            },
            dev : {
                files : {
                    'build/css/client.css' : 'src/css/index.scss'
                },
                options : {
                    sourceMapEmbed : true
                }
            },
            dist : {
                files : {
                    'build/css/client.css' : 'src/css/index.scss'
                },
                options : {
                    sourceMapEmbed : false
                }
            }
        },

        copy : {
            imagesDev : {
                files : [
                    { expand : true, cwd : 'src/images/', src : [ '**' ], dest : 'build/images/' }
                ]
            },
            imagesDist : {
                files : [
                    { expand : true, cwd : 'src/images/', src : [ '**' ], dest : 'build/dist/images/' }
                ]
            }
        },

        ejs : {
            dev : {
                options : {
                    staticUrl : devStaticDir
                },
                src : 'src/html/index.ejs',
                dest : 'build/index.html'
            },
            dist : {
                options : {
                    staticUrl : distStaticDir
                },
                src : 'src/html/index.ejs',
                dest : 'build/index.html'
            }
        },

        uglify : {
            dist: {
                files : {
                    'build/js/client.js' : [ 'build/js/client.js' ]
                }
            }
        },

        compress : {
            dist : {
                options : {
                    mode : 'gzip'
                },
                files : [
                    { expand : true, cwd : 'build/', src : [ '**/*.js' ], dest : 'build/dist/', ext : '.js.gz' },
                    { expand : true, cwd : 'build/', src : [ '**/*.css' ], dest : 'build/dist/', ext : '.css.gz' },
                    { expand : true, cwd : 'build/', src : [ '**/*.html' ], dest : 'build/dist/', ext : '.html.gz' }
                ]
            }
        },

        aws_s3 : {
            options : {
                awsProfile : 'fantasybach',
                gzipRename : 'ext',
                uploadConcurrency : 8,
                region : 'us-west-2'
            },
            resources : {
                options : {
                    bucket : 'resources.fantasybach.com'
                },
                files: [
                    { expand : true, cwd : 'build/dist/', src : [ '**', '!**/*.html', '!**/*.html.gz' ], dest : version + '/', action : 'upload' }
                ]
            },
            html : {
                options : {
                    bucket : 'resources.fantasybach.com'
                },
                files: [
                    { expand : true, cwd : 'build/dist/', src : [ '**/*.html', '**/*.html.gz' ], dest : '/', action : 'upload' }
                ]
            }
        },

        watch : {
            css : {
                files : [ 'src/css/**/*.scss' ],
                tasks : [ 'sass:dev' ]
            }
        },

        concurrent : {
            watch : [ 'watch:css', 'browserify:dev' ],
            build : [ 'copy:imagesDev', 'ejs:dev', 'sass:dev' ]
        }
    });

    grunt.registerTask('default', [ 'concurrent:build', 'concurrent:watch' ]);
    grunt.registerTask('build', [ 'clean', 'copy:imagesDist', 'sass:dist', 'browserify:dist', 'uglify:dist', 'ejs:dist' ]);
    grunt.registerTask('deploy', [ 'compress:dist', 'aws_s3:resources', 'aws_s3:html' ]);
    grunt.registerTask('release', [ 'build', 'deploy' ]);
};
