var path = require("path");
var _ = require("lodash");

module.exports = function (grunt) {
    // Path to the client src
    var srcPath = path.resolve(__dirname, "src");

    // Load grunt modules
    grunt.loadNpmTasks('hr.js');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-node-webkit-builder');

    var NW_VERSION = "0.9.2";

    // Init GRUNT configuraton
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        hr: {
            app: {
                // Base directory for the application
                "base": srcPath,

                // Application name
                "name": "Codebox",

                // Mode debug
                "debug": true,

                // Main entry point for application
                "main": "main",

                // HTML entry point
                'index': grunt.file.read(path.resolve(srcPath, "index.html")),

                // Build output directory
                "build": path.resolve(__dirname, "build"),

                // Static files mappage
                "static": {
                    "ace": path.resolve(srcPath, "vendors", "ace"),
                    "fonts": path.resolve(srcPath, "resources", "fonts"),
                    "images": path.resolve(srcPath, "resources", "images")
                },

                // Stylesheet entry point
                "style": path.resolve(srcPath, "resources/stylesheets/main.less"),

                // Modules paths
                'paths': {
                    "ace": "vendors/ace/ace"
                },
                "shim": {
                    "main": {
                        deps: [
                            'hr/dom',
                            'vendors/bootstrap/carousel',
                            'vendors/bootstrap/dropdown',
                            'vendors/bootstrap/button',
                            'vendors/bootstrap/modal',
                            'vendors/bootstrap/affix',
                            'vendors/bootstrap/alert',
                            'vendors/bootstrap/collapse',
                            'vendors/bootstrap/tooltip',
                            'vendors/bootstrap/popover',
                            'vendors/bootstrap/scrollspy',
                            'vendors/bootstrap/tab',
                            'vendors/bootstrap/transition'
                        ]
                    },
                    "ace": {
                        exports: "ace"
                    }
                },
                'args': {},
                'options': {}
            }
        },
        nodewebkit: {
            options: {
                app_name: "GitBook",
                build_dir: './appbuilds',
                mac: true,
                win: false,
                linux32: false,
                linux64: false,
                mac_icns: "./build/static/images/icons/512.icns",
                credits: "./src/credits.html",
                version: NW_VERSION,
                zip: false
            },
            src: ['./**/*']
        },
        clean: {
            build: ['build/'],
            releases: ['appbuilds/releases']
        }
    });

    // Build
    grunt.registerTask('build', [
        'hr:app'
    ]);

    // Release
    grunt.registerTask('build-apps', [
        'clean:releases',
        'build',
        'nodewebkit'
    ]);

    grunt.registerTask('default', [
        'build'
    ]);
};
