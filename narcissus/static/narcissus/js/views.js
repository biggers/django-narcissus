Narcissus.AppView = Backbone.View.extend({
    el: $('body'),

    initialize: function() {
        this.render();
    },

    render: function() {
        $('#content').html(Narcissus.homeTemplate());
    }
});