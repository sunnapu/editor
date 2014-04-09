define([
    "hr/hr"
], function(hr) {
    var TYPE_FILE = "file";
    var TYPE_DIRECTORY = "directory";

    var File = hr.Model.extend({
        defaults: {
            path: null,
            name: null,
            type: TYPE_FILE
        },


    }, {
        TYPES: {
            FILE: TYPE_FILE,
            DIRECTORY: TYPE_DIRECTORY
        }
    });

    return File;
});