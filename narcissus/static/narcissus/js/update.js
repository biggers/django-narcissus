Narcissus.Update = Backbone.Model.extend({

    toString: function() {
        return this.get('message').split(" ").slice(0, 3).join(" ");
    }

});

Narcissus.UpdateView = Narcissus.PostView.extend({
    $statusElement: $('#status_count'),

    initialize: function(options) {
        Narcissus.PostView.prototype.initialize.call(this, options);
        _.bindAll(this, 'render', 'renderCharacterCount');
        this.events[options.urlValue + ' keyup'] = 'renderCharacterCount';
        this.events[options.urlValue + ' keydown'] = 'renderCharacterCount';
    },

    render: function() {
        Narcissus.PostView.prototype.render.call(this);
        this.$statusElement.tooltip({placement: 'left'});
    },

    renderCharacterCount: function() {
        var max = 300;
        var remaining = max - $url_value.val().length;
        this.$statusElement.text(remaining);

        if (remaining > 0) {
            this.$statusElement.removeClass('error');
        } else {
            this.$statusElement.addClass('error');
        }
    }

});
