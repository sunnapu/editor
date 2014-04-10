define([
    "hr/hr",
    "hr/utils",
    "models/article"
], function(hr, Article) {
    var parseSummary = node.require("gitbook").parse.summary;

    var Articles = hr.Collection.extend({
        Model: Article,

        /*
         *  Parse SUMMARY.md content to extract articles tree
         */
        parseSummary: function(content) {
            var summary = parseSummary(content);
            
            this.reset(summary.chapters);
        },

        /*
         *  Return a markdown representation of the summary
         */
        toMarkdown: function() {
            var bl = "\n";
            var content = "# Summary"+bl;

            this.each(function(article) {
                var title = article.get("title");
                var path = article.get("path");

                if (path) {
                    content = content + "* ["+title+"]("+path+")";
                } else {
                    content = content + "* "+title;
                }
                content = content+bl;
            });

            content = content+bl;

            return content;
        }
    });

    return Articles;
});