Narcissus.AppRouter = Backbone.Router.extend({

    routes: {
        "dashboard/": "dashboard",
        "dashboard/:posttype/": "posttype"
    },

    dashboard: function() {
        /*
         * Render the template for the first posttype available.
         */

        postType = Narcissus.postTypes[0];
        Narcissus.appView = new Narcissus.AppView({currentPostType: postType});
    },

    posttype: function(postTypeName) {
        /*
         * Render the template for the specified posttype.
         */
        var postType, postTypeView = window;
        postType = _.find(Narcissus.postTypes, function(postType) {
            return postType.name == postTypeName;
        });
        Narcissus.appView = new Narcissus.AppView({currentPostType: postType});
    }

});
