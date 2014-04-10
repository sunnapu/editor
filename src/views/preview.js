define([
    "hr/hr",
    "hr/utils",
    "hr/promise",
    "hr/dom",
    "text!resources/templates/preview.html"
], function(hr, _, Q, $, templateFile) {
    var path = node.require("path");
    var parse = node.require("gitbook").parse;

    var Preview = hr.View.extend({
        className: "preview",
        template: templateFile,

        initialize: function() {
            Preview.__super__.initialize.apply(this, arguments);

            this.book = this.parent;
            this.sections = [];

            this.listenTo(this.book, "open", this.onArticleChange);
        },

        templateContext: function() {
            return {
                sections: this.sections
            };
        },

        parseArticle: function(article, content) {
            var that = this;
            var _input = article.get("path");

            return Q()
            .then(function() {
                // Lex page
                return parse.lex(content);
            })
            .then(function(lexed) {
                // Get HTML generated sections
                return parse.page(lexed, {
                    repo: "",
                    dir: path.dirname(_input) || '/',
                    outdir: path.dirname(_input) || '/',
                });
            })
            .then(function(sections) {
                that.sections = sections;
                that.update();
            });
        },

        onArticleChange: function(article) {
            var that = this;

            this.book.readArticle(article)
            .then(_.partial(this.parseArticle, article).bind(this));
        }
    });

    return Preview;
});