define([
    "hr/hr",
    "hr/dom",
    "ace"
], function(hr, $, ace) {
    var aceconfig = ace.require("ace/config");
    aceconfig.set("basePath", "static/ace");

    var Editor = hr.View.extend({
        className: "editor",

        initialize: function() {
            Editor.__super__.initialize.apply(this, arguments);

            this.$inner = $("<div>", {'class': "inner"});
            this.$inner.appendTo(this.$el);

            this.editor = ace.edit(this.$inner.get(0));

            this.editor.setTheme("ace/theme/chrome");
            this.editor.getSession().setMode("ace/mode/markdown");
            this.editor.setShowPrintMargin(false);
        }
    });

    return Editor;
});