require([
    "hr/utils",
    "hr/dom",
    "hr/hr",
    "hr/args",
    "platform/infos",
    "text!resources/templates/main.html"
], function(_, $, hr, args, platform, templateFile) {
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
            
        },

        initialize: function() {
            Application.__super__.initialize.apply(this, arguments);
            return this;
        },

        templateContext: function() {
            return {
                hasLocalFs: platform.fs.local != null
            };
        },

        finish: function() {
            return Application.__super__.finish.apply(this, arguments);
        }
    });

    var app = new Application();
    app.run();
});
