Narcissus.AppView = Backbone.View.extend({
    el: $('body'),

    initialize: function(options) {
        _.bindAll(this, 'render');
        this.currentPostType = options.currentPostType;

        this.render();
        var PostTypeView = this.currentPostType.getView();
        this.postTypeView = new PostTypeView();
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