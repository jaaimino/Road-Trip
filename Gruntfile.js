module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        connect: {
            example: {
                port: 8080
            }
        }
    });
    grunt.loadNpmTasks('grunt-connect');
    grunt.registerTask('default', 'connect:example');
};