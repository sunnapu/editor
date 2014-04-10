define([
    "hr/hr",
    "collections/articles",
    "text!resources/templates/article.html"
], function(hr, Articles, templateFile) {

    var ArticleItem = hr.List.Item.extend({
        className: "article",
        template: templateFile,
        events: {
            "click": "open",
            "dblclick": "toggleEdit",

            "change > input": "onChangeTitle",
            "keyup > input": "onKeyUp",
            "click > input": function(e) { e.stopPropagation(); }
        },

        initialize: function() {
            ArticleItem.__super__.initialize.apply(this, arguments);

            this.articles = new ArticlesView({}, this.list.parent);
            this.editor = this.list.parent.parent;
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

            this.editor.openArticle(this);
        },

        toggleEdit: function(e) {
            var $input = this.$("> input");
            if (typeof e != "boolean") {
                e.preventDefault();
                e.stopPropagation();
                e = null;
            }

            this.$el.toggleClass("mode-edit", e);
            if (this.$el.hasClass("mode-edit")) {
                $input.focus();
            } else {
                $input.blur();
            }
        },

        onChangeTitle: function() {
            this.toggleEdit(false);
            this.model.set("title", this.$("> input").val());
        },

        onKeyUp: function(e) {
            if (e.which == 13) this.toggleEdit(false);
        }
    });

    var ArticlesView = hr.List.extend({
        className: "articles",
        Collection: Articles,
        Item: ArticleItem
    });

    return ArticlesView;
});