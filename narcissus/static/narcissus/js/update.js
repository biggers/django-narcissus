Narcissus.Update = Backbone.Model.extend({

    toString: function() {
        return this.get('message').split(" ").slice(0, 3).join(" ");
    }

});

Narcissus.UpdateView = Narcissus.PostView.extend({
    $statusElement: $('#status_count'),

    initialize: function(options) {
        Narcissus.PostView.prototype.initialize.call(this, options);
        _.bindAll(this, 'render', 'renderUrl', 'renderCharacterCount');
        this.$statusElement.tooltip({placement: 'left'});
    },

    renderUrl: function() {
        Narcissus.PostView.prototype.renderUrl.call(this);
        this.renderCharacterCount();
    },

    delegateEvents: function(events) {
        return Narcissus.PostView.prototype.delegateEvents.call(this, events);
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
