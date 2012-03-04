Narcissus.AppView = Backbone.View.extend({
    el: $('body'),

    initialize: function(options) {
        _.bindAll(this, 'render');
        this.currentPostType = options.currentPostType;

        // This feels hacky and inflexible, but it's safer than eval()
        var postTypeView = window;
        _.each(this.currentPostType.view.split('.'), function(attr) {
            postTypeView = postTypeView[attr];
        });

        this.render();
        this.postTypeView = new postTypeView();
    },

    render: function() {
        $('#content').html(Narcissus.homeTemplate({
            currentPostType: this.currentPostType
        }));
        $('#main-nav-buttons').html(Narcissus.navButtonTemplate({
            currentPostType: this.currentPostType
        }));

        // Hijack the PostType links
        $('.posttype-link').click(function(event) {
            Narcissus.appRouter.navigate(
                $(event.target).attr('href'),
                {trigger: true}
            );
            return false;
        });
    }
});