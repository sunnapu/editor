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
    var gui = node.gui;
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
            "change .local-file-selector": "onLocalSelectionChange"
        },

        initialize: function() {
            Application.__super__.initialize.apply(this, arguments);

            var that = this;

            this.editor = null;
            this.book = null;

            

            var menu = new gui.Menu({ type: 'menubar' });

            var fileMenu = new node.gui.Menu();
            fileMenu.append(new gui.MenuItem({
                label: 'Open',
                click: function () {
                    that.openFolderSelection();
                }
            }));
            fileMenu.append(new gui.MenuItem({
                type: 'separator'
            }));
            fileMenu.append(new gui.MenuItem({
                label: 'Close',
                click: function () {
                    gui.Window.get().close();
                }
            }));

            var devMenu = new node.gui.Menu();
            devMenu.append(new gui.MenuItem({
                label: 'Open Tools',
                click: function () {
                    var win = gui.Window.get();
                    win.showDevTools();
                }
            }));

            menu.append(new gui.MenuItem({
                label: 'File',
                submenu: fileMenu
            }));
            menu.append(new gui.MenuItem({
                label: 'Develop',
                submenu: devMenu
            }));
            gui.Window.get().menu = menu;
        },

        render: function() {
            gui.Window.get().show();

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
        openFolderSelection: function(e) {
            if (e) e.preventDefault();

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
