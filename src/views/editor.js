define([
    "hr/hr",
    "hr/dom",
    "ace",
    "text!resources/templates/editor.html"
], function(hr, $, ace, templateFile) {
    var aceconfig = ace.require("ace/config");
    aceconfig.set("basePath", "static/ace");

    var Editor = hr.View.extend({
        className: "book-section editor",
        template: templateFile,

        initialize: function() {
            Editor.__super__.initialize.apply(this, arguments);

            this.book = this.parent;

            this.$editor = $("<div>", {'class': "editor"});
            this.$editor.appendTo(this.$el);

            this.ignoreChange = false;

            this.editor = ace.edit(this.$editor.get(0));

            this.editor.on("change", function() {
                if (this.ignoreChange || !this.book.currentArticle) return;

                var content = this.editor.getValue();
                this.book.writeArticle(this.book.currentArticle, content);
            }.bind(this));

            this.editor.setTheme({
                'isDark': false,
                'cssClass': "ace-tm",
                'cssText': ""
            });
            this.editor.getSession().setMode("ace/mode/markdown");
            this.editor.setOption("showGutter", false);
            this.editor.setShowPrintMargin(false);
            this.editor.setHighlightActiveLine(false);

            this.listenTo(this.book, "article:open", this.onArticleChange);
            this.listenTo(this.book, "article:state", this.onArticleState);
        },

        finish: function() {
            this.$editor.appendTo(this.$(".content"));
            return Editor.__super__.finish.apply(this, arguments);
        },

        // When the user opens another article
        onArticleChange: function(article) {
            var that = this;

            this.book.readArticle(article)
            .then(function(content) {
                that.ignoreChange = true;
                that.editor.setValue(content);
                that.editor.gotoLine(0);
                that.ignoreChange = false;
            });
        },

        // When the state of the current article change
        onArticleState: function(article, state) {
            this.$(".action-save").toggleClass("disabled", state);
            this.$(".action-save").toggleClass("btn-warning", !state);
        }
    });

    return Editor;
});