define([
    "hr/hr",
    "text!resources/templates/article.html"
], function(hr, templateFile) {

    var ArticleItem = hr.List.Item.extend({
        className: "article",
        template: templateFile,
        events: {
            
        },

        templateContext: function() {
            return {
                'article': this.model
            };
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
            ])
        }
    });

    return Summary;
});