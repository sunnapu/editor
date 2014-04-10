define([
    "hr/hr",
    "views/grid",
    "views/summary",
    "views/editor",
    "views/preview"
], function(hr, Grid, Summary, Editor, Preview) {
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
            this.grid.addView(this.summary, {width: 20});

            // Editor
            this.grid.addView(new Editor({}, this));

            // preview
            this.grid.addView(new Preview({}, this));
        },

        /*
         *  Open an editor for an article
         */
        openEditor: function(article) {

        }
    });

    return Book;
});