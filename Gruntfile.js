module.exports = function(grunt) {
    // Project configuration.
    grunt.initConfig({

        ngconstant: {
            options: {
                space: '  ',
                wrap: '"use strict";\n\n {%= __ngModule %}',
                name: 'cr.config',
                dest: 'app/config.js'
            },
            dev: {
                constants: {
                    CONFIG: {
                        name: 'development',
                        API: 'http://127.0.0.1:8000/api'
                    }
                }
            },
            prod: {
                constants: {
                    CONFIG: {
                        name: 'production',
                        API: 'http://cr-app.herokuapp.com/api'
                    },
                }
            }
        }

    });

    grunt.loadNpmTasks('grunt-ng-constant');
    grunt.registerTask('build', function(target){
        grunt.task.run([
            'ngconstant:'+ (target || 'dev')
        ]);
    });

};