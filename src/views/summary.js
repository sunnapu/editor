define([
    "hr/hr",
    "text!resources/templates/article.html"
], function(hr, templateFile) {

    var ArticleItem = hr.List.Item.extend({
        className: "article",
        template: templateFile,
        events: {
            "click": "open"
        },

        templateContext: function() {
            return {
                'article': this.model
            };
        },

        open: function(e) {
            e.preventDefault();
            e.stopPropagation();

            this.parent.parent.parent.openEditor(this);
        }
    });

    var ArticlesView = hr.List.extend({
        className: "articles",
        Collection: hr.Collection,
        Item: ArticleItem
    });


    var Summary = hr.View.extend({
        className: "summary",

        initialize: function() {
            Summary.__super__.initialize.apply(this, arguments);

            this.articles = new ArticlesView({}, this);
            this.articles.appendTo(this);

            this.articles.collection.reset([
                {
                    title: "Test"
                },
                {
                    title: "Test 2"
                }
            ]);

            this.load();
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