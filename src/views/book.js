define([
    "hr/hr",
    "utils/dialogs",
    "views/grid",
    "views/summary",
    "views/editor",
    "views/preview"
], function(hr, dialogs, Grid, Summary, Editor, Preview) {
    var Book = hr.View.extend({
        className: "book",
        defaults: {
            fs: null
        },

        initialize: function() {
            Book.__super__.initialize.apply(this, arguments);

            this.fs = this.options.fs;

            this.grid = new Grid({
                columns: 3
            }, this);
            this.grid.appendTo(this);

            // Summary
            this.summary = new Summary({}, this);
            this.summary.update();
            this.grid.addView(this.summary, {width: 20});

            // Editor
            this.editor = new Editor({}, this);
            this.editor.update();
            this.grid.addView(this.editor);

            // Preview
            this.preview = new Preview({}, this);
            this.preview.update();
            this.grid.addView(this.preview);
        },

        /*
         * Show an article
         */
        openArticle: function(article) {
            if (!article.get("path")) {
                dialogs.prompt("Enter filename for this chapter:", "", article.get("title")+".md")
                .then(function(path) {
                    article.set("path", path);
                });
            }
        }
    });

    return Book;
});