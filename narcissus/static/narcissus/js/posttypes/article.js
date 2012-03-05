Narcissus.Article = Backbone.Model.extend({

    urlRoot: function() {
        return '/api/article/';
    },

    toString: function() {
        return this.get('title');
    }

});

Narcissus.ArticleView = Narcissus.PostView.extend({
    modelClass: Narcissus.Article,
    postTypeName: 'article',
    urlValue: '#id_title',

    initialize: function(options) {
        _.bindAll(this, 'render', 'toggleDescription');
        Narcissus.PostView.prototype.initialize.call(this, options);
        this.events['click #article_show_description'] = 'toggleDescription';
    },

    render: function() {
        Narcissus.PostView.prototype.render.call(this);

        $('#content-fields').html(Narcissus.articleTemplate());
        $('#extra-details').html(Narcissus.articleExtrasTemplate());

        this.$descriptionInput = $('#article_description_input');
        this.$descriptionInput.hide();
    },

    toggleDescription: function(event) {
        event.preventDefault();
        this.$descriptionInput.toggle(500);
    }

});
