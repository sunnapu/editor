define([
    "hr/hr",
    "hr/dom",
    "ace"
], function(hr, $, ace) {
    var aceconfig = ace.require("ace/config");
    aceconfig.set("basePath", "static/ace");

    var Editor = hr.View.extend({
        className: "editor",

        initialize: function() {
            Editor.__super__.initialize.apply(this, arguments);

            this.book = this.parent;

            this.$inner = $("<div>", {'class': "inner"});
            this.$inner.appendTo(this.$el);

            this.ignoreChange = false;

            this.editor = ace.edit(this.$inner.get(0));

            this.editor.on("change", function() {
                if (this.ignoreChange || !this.book.currentArticle) return;

                var content = this.editor.getValue();
                this.book.writeArticle(this.book.currentArticle, content);
            }.bind(this));

            this.editor.setTheme("ace/theme/chrome");
            this.editor.getSession().setMode("ace/mode/markdown");
            this.editor.setShowPrintMargin(false);

            this.listenTo(this.book, "article:open", this.onArticleChange);
        },

        onArticleChange: function(article) {
            var that = this;

            this.book.readArticle(article)
            .then(function(content) {
                that.ignoreChange = true;
                that.editor.setValue(content);
                that.editor.gotoLine(0);
                that.ignoreChange = false;
            });
        }
    });

    return Editor;
});