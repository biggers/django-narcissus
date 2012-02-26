Narcissus.Article = Backbone.Model.extend({

    toString: function() {
        return this.get('title');
    }

});

Narcissus.ArticleView = Narcissus.PostView.extend({
    $descriptionInput: $('#article_description_input'),

    initialize: function(options) {
        Narcissus.PostView.prototype.initialize.call(this, options);
        _.bindAll(this, 'render', 'toggleDescription');
        this.events['#article_show_description click'] = 'toggleDescription';
    },

    render: function() {
        Narcissus.PostView.prototype.render.call(this);
        this.$descriptionInput.hide();
    },

    toggleDescription: function(event) {
        event.preventDefault();
        this.$descriptionInput.toggle(500);
    }

});
