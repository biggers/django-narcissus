Narcissus.AppRouter = Backbone.Router.extend({

    routes: {
        "dashboard/": "dashboard",
        "dashboard/:posttype/": "posttype"
    },

    dashboard: function() {
        /*
         * Redirect to the first PostType available
         */

        postType = Narcissus.postTypes.at(0);
        this.navigate('/dashboard/' + postType.get('name') + "/", {trigger: true});
    },

    posttype: function(postTypeName) {
        /*
         * Render the template for the specified posttype.
         */
        var postType, postTypeView = window;
        postType = Narcissus.postTypes.find(function(postType) {
            return postType.get('name') == postTypeName;
        });
        document.title = postType.get('title') + " : Narcissus";
        Narcissus.appView = new Narcissus.AppView({currentPostType: postType});
    }

});
