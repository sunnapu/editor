define([
    "hr/hr"
], function(hr) {
    var Article = hr.Model.extend({
        defaults: {
            title: null,
            path: null
        },

        initialize: function() {
            Article.__super__.initialize.apply(this, arguments);

            this.file = this.options.file;
        }
    });

    return Article;
});