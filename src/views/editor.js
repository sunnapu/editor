define([
    "hr/hr",
    "text!resources/templates/editor.html"
], function(hr, templateFile) {
    var Editor = hr.View.extend({
        className: "editor",
        template: templateFile,
        defaults: {
            fs: null
        }
    });

    return Editor;
});