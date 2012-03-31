Narcissus.AppRouter = Backbone.Router.extend({

    routes: {
        "dashboard/": "dashboard",
        "dashboard/:posttype/": "posttype",
        "dashboard/:posttype/:id/": "post"
    },

    navigate: function(fragment, options) {
        /* Scroll to the top on navigation */
        $("html, body").animate({scrollTop: 0}, "fast");
        Backbone.Router.prototype.navigate.call(this, fragment, options);
    },

    dashboard: function() {
        /*
         * Redirect to the first PostType available
         */

        postType = Narcissus.postTypes.at(0);
        this.navigate('/dashboard/' + postType.get('name') + "/", {trigger: true});
    },

    posttype: function(name) {
        /* Render the template for the specified posttype */
        var postType;
        postType = Narcissus.postTypes.getFromName(name);
        document.title = postType.get('title') + " : Narcissus";
        Narcissus.appView = new Narcissus.AppView({currentPostType: postType});
    },

    post: function(postTypeName, postId) {
        /* Render the template for a specific post */
        var post;
        post = Narcissus.posts.get(parseInt(postId));
        document.title = post.get('display_title') + " : Narcissus";
        Narcissus.appView = new Narcissus.AppView({currentPost: post});
    }

});
