define([
    "hr/hr",
    "hr/dom"
], function(hr, $) {
    var Preview = hr.View.extend({
        className: "preview",

        initialize: function() {
            Preview.__super__.initialize.apply(this, arguments);

            this.$inner = $("<div>", {'class': "inner"});
            this.$inner.appendTo(this.$el);
        }
    });

    return Preview;
});