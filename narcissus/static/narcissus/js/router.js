Narcissus.AppRouter = Backbone.Router.extend({

    routes: {
        "dashboard/": "dashboard",
        "dashboard/:posttype/": "posttype"
    },

    dashboard: function() {
        /*
         * Redirect to the first PostType available
         */

        postType = Narcissus.postTypes[0];
        this.navigate('/dashboard/' + postType.name + "/", {trigger: true});
    },

    posttype: function(postTypeName) {
        /*
         * Render the template for the specified posttype.
         */
        var postType, postTypeView = window;
        postType = _.find(Narcissus.postTypes, function(postType) {
            return postType.name == postTypeName;
        });
        document.title = postType.title + " : Narcissus";
        Narcissus.appView = new Narcissus.AppView({currentPostType: postType});
    }

});
