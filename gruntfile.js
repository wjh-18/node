/**
 * Created by Administrator on 2017/9/4.
 */
module.exports = function(grunt){

    grunt.initConfig({
        watch : {
            pug : {
                files : ['views/**'],
                options : {
                    livereload : true
                }
            },
            js : {
                files : ['public/js/**', 'schemas/**/*.js', 'models/**/*/js'],
                // tasks : ['jshint'],
                options : {
                    livereload : true
                }
            }
        },
        nodemon : {
            dev : {
                options : {
                    file : 'app.js',
                    args : [],
                    ignoredFiles : ['README.md', 'node_modules/**', '.DS_Store'],
                    watchedExtensions : ['js'],
                    watchedFolders : ['./'],
                    debug : true,
                    delayTime : 1,
                    env : {
                        PORT : 3000
                    },
                    cwd : __dirname
                }
            }
        },
        concurrent : {
            tasks : ['nodemon', 'watch'],
            options : {
                logConcurrentOutput : true
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-nodemon');
    grunt.loadNpmTasks('grunt-concurrent');

    grunt.option('force' , true);

    grunt.registerTask('default', ['concurrent']);

}