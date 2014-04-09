define([
    "hr/hr",
    "views/grid",
    "views/summary"
], function(hr, Grid, Summary) {
    var Editor = hr.View.extend({
        className: "editor",
        defaults: {
            fs: null
        },

        initialize: function() {
            Editor.__super__.initialize.apply(this, arguments);

            this.fs = this.options.fs;

            this.grid = new Grid({
                columns: 3
            }, this);
            this.grid.appendTo(this);

            // Summary
            this.summary = new Summary(this);
            this.grid.addView(this.summary, {width: 20});

            // Editor
            this.grid.addView(new hr.View({}, this));

            // preview
            this.grid.addView(new hr.View({}, this));
        }
    });

    return Editor;
});