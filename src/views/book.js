define([
    "hr/hr",
    "hr/promise",
    "utils/dialogs",
    "models/article",
    "views/grid",
    "views/summary",
    "views/editor",
    "views/preview"
], function(hr, Q, dialogs, Article, Grid, Summary, Editor, Preview) {
    var Book = hr.View.extend({
        className: "book",
        defaults: {
            fs: null
        },

        initialize: function() {
            Book.__super__.initialize.apply(this, arguments);

            this.fs = this.options.fs;

            // Map article path -> content
            this.articles = {};
            this.currentArticle = null;

            this.grid = new Grid({
                columns: 3
            }, this);
            this.grid.appendTo(this);

            // Summary
            this.summary = new Summary({}, this);
            this.summary.update();
            this.grid.addView(this.summary, {width: 20});

            // Editor
            this.editor = new Editor({}, this);
            this.editor.update();
            this.grid.addView(this.editor);

            // Preview
            this.preview = new Preview({}, this);
            this.preview.update();
            this.grid.addView(this.preview);

            this.openReadme();
        },

        /*
         * Show an article
         */
        openArticle: function(article) {
            var that = this;

            var doOpen = function() {
                that.currentArticle = article;
                that.trigger("article:open", article);
                that.triggerArticleState(article);

                that.toggleArticlesClass("active", article);

                return Q();
            };

            if (!article.get("path")) {
                return dialogs.saveAs(article.get("title")+".md", that.fs.options.base)
                .then(function(path) {
                    if (!that.fs.isValidPath(path)) return Q.reject(new Error("Invalid path for saving this article, need to be on the book repository."));
                    path = that.fs.virtualPath(path);
                    article.set("path", path);
                })
                // Write article
                .then(function() {
                    return that.writeArticle(article, "#"+article.get("title")+"\n")
                })
                // Save the article
                .then(function() {
                    return that.saveArticle(article);
                })
                // Save summary
                .then(function() {
                    return that.summary.save();
                })
                .then(function() {
                    return doOpen();
                })
                .fail(function(err) {
                    dialogs.alert("Error", err.message || err);
                });
            }

            return doOpen();
        },

        /*
         * Show introduction
         */
        openReadme: function() {
            return this.openArticle(new Article({}, {
                title: "Introduction",
                path: "README.md"
            }));
        },

        // Read/Write article in this fs
        readArticle: function(article) {
            var that = this;
            var path = article.get("path");

            if (this.articles[path]) return Q(this.articles[path].content);

            return this.fs.read(path)
            .then(function(content) {
                that.articles[path] = {
                    content: content,
                    saved: true
                };
                return content;
            });
        },
        writeArticle: function(article, content) {
            var path = article.get("path");

            this.articles[path] = this.articles[path] || {};
            this.articles[path].saved = false;
            this.articles[path].content = content;

            this.trigger("article:write", article);
            this.triggerArticleState(article);

            return Q();
        },
        saveArticle: function(article) {
            var that = this;
            var path = article.get("path");
            if (!this.articles[path]) return Q.reject(new Error("No content to save for this article"));

            return this.fs.write(article.get("path"), this.articles[path].content)
            .then(function() {
                that.articles[path].saved = true;
                that.triggerArticleState(article);
            });
        },
        triggerArticleState: function(article) {
            var path = article.get("path");
            var st = this.articles[path]? this.articles[path].saved : true;
            
            this.trigger("article:state", article, st);
            this.toggleArticleClass(article, "modified", !st);
        },
        getArticleState: function(article) {
            article = article || this.currentArticle;
            var path = article.get("path");
            return this.articles[path];
        },
        toggleArticleClass: function(article, className, st) {
            this.$("*[data-article='"+article.get("path")+"']").toggleClass(className, st);
        },
        toggleArticlesClass: function(article, className) {
            this.$("*[data-article]").each(function() {
                $(this).toggleClass(className, $(this).data("article") == article.get("path"));
            });
        }
    });

    return Book;
});