module.exports = function (grunt) {
    // Path to the client src
    var srcPath = path.resolve(__dirname, "src");

    // Load grunt modules
    grunt.loadNpmTasks('hr.js');
    grunt.loadNpmTasks('grunt-contrib-clean');

    var hrConfig = {
        // Base directory for the application
        "base": srcPath,

        // Application name
        "name": "Codebox",

        // Mode debug
        "debug": true,

        // Main entry point for application
        "main": "main",

        // Build output directory
        "build": path.resolve(__dirname, "build"),

        // Static files mappage
        "static": {
            "images": path.resolve(srcPath, "resources", "images")
        },

        // Stylesheet entry point
        "style": path.resolve(srcPath, "resources/stylesheets/main.less"),

        // Modules paths
        'paths': {
            "platform": "platforms/chrome",
        },
        "shim": {},
        'args': {},
        'options': {}
    };

    // Init GRUNT configuraton
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        hr: {
            node: _.extend({}, hrConfig, {
                'index': grunt.file.read(path.resolve(srcPath, "platforms/node/index.html")),
                'paths': {
                    "platform": "platforms/node"
                }
            }),
            chrome: _.extend({}, hrConfig, {
                'index': grunt.file.read(path.resolve(srcPath, "platforms/chrome/index.html")),
                'paths': {
                    "platform": "platforms/chrome"
                }
            })
        },
        clean: {
            build: ['build/']
        }
    });

    // Build
    grunt.registerTask('build', [
        'hr'
    ]);

    grunt.registerTask('default', [
        'build'
    ]);
};
