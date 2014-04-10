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

    return ArticlesView;
});