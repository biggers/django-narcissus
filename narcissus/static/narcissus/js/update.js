Narcissus.Update = Backbone.Model.extend({

    urlRoot: function() {
        return '/api/update/';
    },

    toString: function() {
        return this.get('message').split(" ").slice(0, 3).join(" ");
    }

});

Narcissus.UpdateView = Narcissus.PostView.extend({
    $statusElement: $('#status_count'),
    modelClass: Narcissus.Update,

    initialize: function(options) {
        Narcissus.PostView.prototype.initialize.call(this, options);
        _.bindAll(this, 'renderUrl', 'renderCharacterCount');
        this.$statusElement.tooltip({placement: 'left'});
    },

    renderUrl: function() {
        Narcissus.PostView.prototype.renderUrl.call(this);
        this.renderCharacterCount();
    },

    renderCharacterCount: function() {
        var max = 300;
        var remaining = max - this.$urlValue.val().length;
        this.$statusElement.text(remaining);

        if (remaining > 0) {
            this.$statusElement.removeClass('error');
        } else {
            this.$statusElement.addClass('error');
        }
    }

});
