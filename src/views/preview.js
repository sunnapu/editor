define([
    "hr/hr",
    "hr/utils",
    "hr/promise",
    "hr/dom",
    "core/server",
    "text!resources/templates/preview.html"
], function(hr, _, Q, $, server, templateFile) {
    var path = node.require("path");
    var parse = node.require("gitbook").parse;

    var Preview = hr.View.extend({
        className: "book-section preview",
        template: templateFile,
        events: {
            "click .content a": "onClickLink",
            "click .server-start": "startServer",
            "click .server-stop": "stopServer"
        },

        initialize: function() {
            Preview.__super__.initialize.apply(this, arguments);

            this.book = this.parent;
            this.sections = [];

            this.listenTo(this.book, "article:open", this.onArticleChange);
            this.listenTo(this.book, "article:write", _.debounce(this.onArticleChange, 150));

            this.listenTo(server, "state", this.onServerUpdate);
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

        // When clicking on a link in the content
        onClickLink: function(e) {
            e.preventDefault();

            var href = $(e.currentTarget).attr("href");
            if (/^https?:\/\//i.test(href)){
                node.gui.Shell.openExternal(href);
            }
        },

        // When article is update (write or open)
        onArticleChange: function(article) {
            var that = this;

            this.book.readArticle(article)
            .then(_.partial(this.parseArticle, article).bind(this));
        },

        // When server state change
        onServerUpdate: function(state) {
            this.$(".server-start").toggleClass("btn-success", state);
            this.$(".server-stop").toggle(state);
        },

        startServer: function(e) {
            if (e) e.preventDefault();

            if (server.isRunning()) {
                server.open();
            } else {
                this.book.refreshPreviewServer();
            }
        },
        stopServer: function(e) {
            if (e) e.preventDefault();

            server.stop();
        }
    });

    return Preview;
});