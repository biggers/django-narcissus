Narcissus.AppView = Backbone.View.extend({
    el: $('body'),

    initialize: function(options) {
        _.bindAll(this, 'render');

        Narcissus.posts.on('add change destroy', this.render, this);

        if (typeof(options.currentPost) !== "undefined") {
            this.currentPostType = Narcissus.postTypes.getFromPostTypeName(options.currentPost.get('posttype'));
        } else {
            this.currentPostType = options.currentPostType;
        }
        this.template = Narcissus.postTypeTemplate;
        this.ContentView = this.currentPostType.getView();

        this.render();

        this.contentView = new this.ContentView({currentPost: options.currentPost});
    },

    render: function() {
        $('#content').html(this.template({
            currentPostType: this.currentPostType
        }));

        $('#main-nav-buttons').html(Narcissus.navButtonTemplate({
            currentPostType: this.currentPostType
        }));

        // Hijack the internal links
        $('.posttype-link, .edit-link').click(function(event) {
            Narcissus.appRouter.navigate(event.target.pathname, {trigger: true});
            return false;
        });
    }

});
