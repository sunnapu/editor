require([
    "hr/utils",
    "hr/dom",
    "hr/promise",
    "hr/hr",
    "hr/args",
    "utils/dialogs",
    "utils/analytic",
    "core/fs",
    "views/book"
], function(_, $, Q, hr, args, dialogs, analytic, Fs, Book) {
    var path = node.require("path");
    var wrench = node.require("wrench");
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
        metas: {},
        links: {},
        events: {},

        initialize: function() {
            Application.__super__.initialize.apply(this, arguments);

            var that = this;

            this.book = new Book({
                fs: new Fs({
                    base: path.join(__dirname, "../intro")
                })
            });
            this.book.update();
            this.book.appendTo(this);

            var menu = new gui.Menu({ type: 'menubar' });

            var fileMenu = new node.gui.Menu();
            fileMenu.append(new gui.MenuItem({
                label: 'New Book',
                click: function () {
                    that.openNewBook();
                }
            }));
            fileMenu.append(new gui.MenuItem({
                label: 'Open Book',
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

            var bookMenu = new node.gui.Menu();
            bookMenu.append(new gui.MenuItem({
                label: 'Preview Website',
                click: function () {
                    that.book.refreshPreviewServer();
                }
            }));
            bookMenu.append(new gui.MenuItem({
                type: 'separator'
            }));
            bookMenu.append(new gui.MenuItem({
                label: 'Build Website As...',
                click: function () {
                    dialogs.folder()
                    .then(function(_path) {
                        if (confirm("Do you really want to erase "+_path+" content and build the book website in it?")) {
                            that.book.buildBook({
                                output: _path
                            })
                            .then(function(options) {
                                node.gui.Shell.showItemInFolder(path.join(_path, "index.html"));
                            });
                        }
                    });
                }
            }));
            bookMenu.append(new gui.MenuItem({
                label: 'Build PDF As...',
                click: function () {
                    that.book.buildBookFile("pdf");
                }
            }));
            bookMenu.append(new gui.MenuItem({
                label: 'Build eBook As...',
                click: function () {
                    that.book.buildBookFile("ebook");
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

            var helpMenu = new node.gui.Menu();
            helpMenu.append(new gui.MenuItem({
                label: 'GitHub',
                click: function () {
                    gui.Shell.openExternal('https://github.com/GitbookIO/gitbook');
                }
            }));
            helpMenu.append(new gui.MenuItem({
                label: 'Send Feedback',
                click: function () {
                    gui.Shell.openExternal('https://github.com/GitbookIO/editor/issues');
                }
            }));

            gui.Window.get().menu = menu;

            menu.insert(new gui.MenuItem({
                label: 'File',
                submenu: fileMenu
            }), 1);
            menu.append(new gui.MenuItem({
                label: 'Book',
                submenu: bookMenu
            }));
            menu.append(new gui.MenuItem({
                label: 'Develop',
                submenu: devMenu
            }));
            menu.append(new gui.MenuItem({
                label: 'Help',
                submenu: helpMenu
            }));
            
        },

        render: function() {
            gui.Window.get().show();
            return this.ready();
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
            analytic.track("open");

            var that = this;
            var _fs = new Fs({
                base: _path
            });

            Book.valid(_fs)
            .then(function() {
                that.setBook(new Book({
                    fs: _fs
                }));
            }, dialogs.error);
        },

        // Click to select a new local folder
        openFolderSelection: function() {
            var that = this;

            dialogs.folder()
            .then(function(_path) {
                that.openPath(_path);
            });
        },

        // Create a new book and open it
        openNewBook: function() {
            var that = this;

            dialogs.folder()
            .then(function(_path) {
                if (confirm("Do you really want to erase "+_path+" content and create a new book in it?")) {
                    Q.nfcall(wrench.copyDirRecursive, path.join(__dirname, "../example"), _path, {forceDelete: true})
                    .then(function() {
                        that.openPath(_path);
                    });
                }
            });
        }
    });

    var app = new Application();
    app.run();
});
