define([
    "hr/hr"
], function(hr) {
    var Article = hr.Model.extend({
        defaults: {
            title: null,
            path: null,
            level: "1",
            articles: []
        },

        initialize: function() {
            Article.__super__.initialize.apply(this, arguments);
        }
    });

    return Article;
});