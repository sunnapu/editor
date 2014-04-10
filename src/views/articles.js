define([
    "hr/hr",
    "collections/articles",
    "text!resources/templates/article.html"
], function(hr, Articles, templateFile) {

    var ArticleItem = hr.List.Item.extend({
        className: "article",
        template: templateFile,
        events: {
            "click": "open"
        },

        initialize: function() {
            ArticleItem.__super__.initialize.apply(this, arguments);

            this.articles = new ArticlesView({}, this.parent.parent);
        },

        render: function() {
            this.articles.collection.reset(this.model.get("articles", []));
            return ArticleItem.__super__.render.apply(this, arguments);
        },

        finish: function() {
            this.articles.appendTo(this.$(".chapter-articles"));
            return ArticleItem.__super__.finish.apply(this, arguments);
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
        Collection: Articles,
        Item: ArticleItem
    });

    return ArticlesView;
});