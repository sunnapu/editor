define([
    "hr/hr",
    "hr/promise"
], function(hr, Q) {
    var _notDefined = function() {
        return Q.reject(new Error("This FS method is not defined"));
    };

    var Fs = hr.Class.extend({
        /*
         * Read a directory content by its path
         *
         * @return Promise([File])
         */
        readdir: function(path) {
            return _notDefined();
        },

        /*
         * Read a file by its path
         *
         * @return Promise(String)
         */
        read: function(path) {
            return _notDefined();
        },

        /*
         * Write a file by its path
         *
         * @return Promise()
         */
        write: function(path) {
            return _notDefined();
        },

        /*
         * Commit all changes
         *
         * @return Promise()
         */
        commit: function(message) {
            return _notDefined();
        }
    });

    return Fs;
});