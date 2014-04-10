define([
    "hr/hr",
    "views/articles",
    "text!resources/templates/summary.html"
], function(hr, ArticlesView, templateFile) {
    var Summary = hr.View.extend({
        className: "summary",
        template: templateFile,

        initialize: function() {
            Summary.__super__.initialize.apply(this, arguments);

            this.articles = new ArticlesView({}, this);

            this.articles.collection.reset([
                {
                    title: "Test"
                },
                {
                    title: "Test 2"
                }
            ]);

            this.load();
            this.update();
        },

        finish: function() {
            console.log("after");
            this.articles.$el.appendTo(this.$(".inner"));
            return Summary.__super__.finish.apply(this, arguments);
        },

        /*
         * Load summary from SUMMARY.md
         */
        load: function() {
            var that = this;

            this.parent.fs.read("SUMMARY.md")
            .then(function(content) {
                that.articles.collection.parseSummary(content);
            });
        },

        /*
         * Save summary content
         */
        save: function() {
            return this.parent.fs.write("SUMMARY.md", this.articles.collection.toMarkdown());
        }
    });

    return Summary;
});