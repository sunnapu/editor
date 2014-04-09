define([
    "hr/hr",
    "hr/promise",
    "core/fs/base"
], function(hr, Q, Fs) {
    var _notDefined = function() {
        return Q.reject(new Error("This GitHub FS method is not defined"));
    };

    var GitHubFs = Fs.extend({
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

    return GitHubFs;
});