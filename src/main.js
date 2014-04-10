require([
    "hr/utils",
    "hr/dom",
    "hr/hr",
    "hr/args",
    "core/fs",
    "views/book",
    "text!resources/templates/main.html"
], function(_, $, hr, args, Fs, Book, templateFile) {
    // Configure hr
    hr.configure(args);

    hr.Resources.addNamespace("templates", {
        loader: "text"
    });

    // Define base application
    var Application = hr.Application.extend({
        name: "GitBook Editor",
        template: templateFile,
        metas: {},
        links: {},
        events: {
            "click .open-local": "onOpenLocal",
            "change .local-file-selector": "onLocalSelectionChange"
        },

        initialize: function() {
            Application.__super__.initialize.apply(this, arguments);

            this.editor = null;
        },

        finish: function() {
            return Application.__super__.finish.apply(this, arguments);
        },

        setBook: function(book) {
            if (this.book) {
                this.book.remove();
            }
            this.book = book;
            this.book.update();
            this.book.appendTo(this);
        },

        // Click to select a new local folder
        onOpenLocal: function(e) {
            e.preventDefault();

            this.$(".local-file-selector").click();
        },

        // Local file selector change
        onLocalSelectionChange: function(e) {
            var path = this.$(".local-file-selector").val();
            if (!path) return;

            this.setBook(new Book({
                fs: new Fs({
                    base: path
                })
            }));
        }
    });

    var app = new Application();
    app.run();
});
