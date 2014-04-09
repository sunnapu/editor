require([
    "hr/utils",
    "hr/dom",
    "hr/hr",
    "hr/args",
    "platform/infos",
    "views/editor",
    "text!resources/templates/main.html"
], function(_, $, hr, args, platform, Editor, templateFile) {
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
            return this;
        },

        templateContext: function() {
            return {
                hasLocalFs: platform.fs.local != null
            };
        },

        finish: function() {
            return Application.__super__.finish.apply(this, arguments);
        },

        setEditor: function(editor) {
            if (this.editor) {
                this.editor.remove();
            }
            this.editor = editor;
            this.editor.update();
            this.editor.appendTo(this);
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

            this.setEditor(new Editor({
                fs: new platform.fs.local({
                    base: path
                })
            }));
        }
    });

    var app = new Application();
    app.run();
});
