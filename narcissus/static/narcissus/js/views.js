Narcissus.AppView = Backbone.View.extend({
    el: $('body'),

    initialize: function(options) {
        _.bindAll(this, 'render');


        this.currentPost = options.currentPost;
        Narcissus.posts.on('add change destroy', this.render, this);

        if (typeof(this.currentPost) !== "undefined") {
            this.currentPostType = Narcissus.postTypes.getFromPostTypeName(this.currentPost.get('posttype'));
            this.template = Narcissus.postDetailTemplate;
            this.ContentView = Narcissus.PostDetailView;
        } else {
            this.currentPostType = options.currentPostType;
            this.template = Narcissus.postTypeTemplate;
            this.ContentView = this.currentPostType.getView();
        }

        this.render();
    },

    render: function() {
        $('#content').html(this.template({
            currentPostType: this.currentPostType,
            currentPost: this.currentPost
        }));

        $('#main-nav-buttons').html(Narcissus.navButtonTemplate({
            currentPostType: this.currentPostType
        }));

        // Hijack the internal links
        $('.posttype-link, .edit-link').click(function(event) {
            Narcissus.appRouter.navigate(event.target.pathname, {trigger: true});
            return false;
        });

        this.contentView = new this.ContentView();
    }

});
