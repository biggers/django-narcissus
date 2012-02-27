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
        this.events['click #article_show_description'] = 'toggleDescription';
        this.$descriptionInput.hide();
    },

    toggleDescription: function(event) {
        event.preventDefault();
        this.$descriptionInput.toggle(500);
    }

});
