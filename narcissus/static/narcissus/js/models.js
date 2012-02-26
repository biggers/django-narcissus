Narcissus.Update = Backbone.Model.extend({

    toString: function() {
        return this.get('message').split(" ").slice(0, 3).join(" ");
    }

});

Narcissus.Article = Backbone.Model.extend({

    toString: function() {
        return this.get('title');
    }

});
