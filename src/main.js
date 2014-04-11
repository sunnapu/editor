require([
    "hr/utils",
    "hr/dom",
    "hr/hr",
    "hr/args",
    "core/fs",
    "views/book",
    "text!resources/templates/main.html"
], function(_, $, hr, args, Fs, Book, templateFile) {
    var path = node.require("path");
    var __dirname = node.require("../src/dirname");

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
            this.book = null;
        },

        render: function() {
            if (this.book) this.book.detach();
            return Application.__super__.render.apply(this, arguments);
        },

        finish: function() {
            if (this.book) this.book.appendTo(this);
            else this.openPath(path.join(__dirname, "../intro"));
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

        // Open a book at a specific path
        openPath: function(_path) {
            this.setBook(new Book({
                fs: new Fs({
                    base: _path
                })
            }));
        },

        // Click to select a new local folder
        onOpenLocal: function(e) {
            e.preventDefault();

            this.$(".local-file-selector").click();
        },

        // Local file selector change
        onLocalSelectionChange: function(e) {
            var _path = this.$(".local-file-selector").val();
            if (!_path) return;

            this.openPath(_path);
        }
    });

    var app = new Application();
    app.run();
});
