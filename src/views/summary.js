define([
    "hr/hr",
    "utils/dragdrop",
    "views/articles",
    "text!resources/templates/summary.html"
], function(hr, dnd, ArticlesView, templateFile) {
    var SummaryTrash = hr.View.extend({
        className: "trash",
        initialize: function() {
            var that = this;
            SummaryTrash.__super__.initialize.apply(this, arguments);

            this.summary = this.parent;

            this.$el.hide();
            this.$el.html('<i class="fa fa-trash-o"></i> Remove');

            // Drop tabs to order
            this.dropArea = new dnd.DropArea({
                view: this,
                dragType: this.summary.drag,
                handler: function(article) {
                    article.destroy();
                    that.summary.save();
                }
            });
        },
    })

    var Summary = hr.View.extend({
        className: "summary",
        template: templateFile,

        initialize: function() {
            Summary.__super__.initialize.apply(this, arguments);

            // Drag and drop of tabs
            this.drag = new dnd.DraggableType();
            this.listenTo(this.drag, "drag:start", function() {
                this.trash.$el.show();
            });
            this.listenTo(this.drag, "drag:end", function() {
                this.trash.$el.hide();
            });

            // Trash
            this.trash = new SummaryTrash({}, this);
            

            this.articles = new ArticlesView({}, this);

            this.load();
        },

        finish: function() {
            this.articles.$el.appendTo(this.$(".inner"));
            this.trash.$el.appendTo(this.$el);
            return Summary.__super__.finish.apply(this, arguments);
        },

        /*
         * Load summary from SUMMARY.md
         */
        load: function() {
            var that = this;

            this.parent.fs.read("SUMMARY.md")
            .then(function(content) {
                that.articles.collection.parseSummary(content);
            }, function(err) {
                console.log("error", err);
            });
        },

        /*
         * Save summary content
         */
        save: function() {
            var that = this;
            
            return this.parent.fs.write("SUMMARY.md", this.articles.collection.toMarkdown())
            .then(function() {
                return that.load();
            });
        }
    });

    return Summary;
});