Narcissus.AppRouter = Backbone.Router.extend({

    routes: {
        "dashboard/": "dashboard",
        "dashboard/:posttype/": "posttype"
    },

    dashboard: function() {
        /*
         * Render the template for the first posttype available.
         */
        var postType = Narcissus.postTypes[0],
            postTypeView = window;

        // This feels hacky and inflexible, but it's safer than eval()
        _.each(postType.view.split('.'), function(attr) {
            postTypeView = postTypeView[attr];
        });

        new postTypeView();
    },

    posttype: function(postType) {

    }

});
