Narcissus.PostType = Backbone.Model.extend({

    toString: function() {
        return this.get('title');
    }

});


Narcissus.PostTypeCollection = Backbone.Collection.extend({
    model: Narcissus.PostType
});


Narcissus.PostCollection = Backbone.Collection.extend({});


Narcissus.PostView = Backbone.View.extend({
    el: '#posttype-content',

    initialize: function() {
        _.bindAll(this, 'render', 'renderUrl', 'submitPost');

        this.postType = Narcissus.postTypes.find(function(postType) {
            return postType.get('name') == this.postTypeName;
        }, this);

        this.events = {};
        this.events['submit'] = 'submitPost';
        this.events['keyup ' + this.urlValue] = 'renderUrl';
        this.events['keydown ' + this.urlValue] = 'renderUrl';

        this.render();

        this.$urlValue = $(this.urlValue);
    },

    render: function() {
        this.$el.html(Narcissus.basePostTemplate({postType: this.postType}));

        this.$urlInput = $('#id_slug');

        var currentWidth = this.$urlInput.width();
        var prependWidth = this.$urlInput.prev('.add-on').outerWidth();
        this.$urlInput.width(currentWidth - prependWidth);

        $('#content-title').text(this.postType.get('title'));
    },

    renderUrl: function(event) {
        this.$urlInput.val(URLify(this.$urlValue.val(), 50));
    },

    submitPost: function(event) {
        var self = this;
        event.preventDefault();

        this.$form = $('#' + this.postType.get('name') + '-form');

        $('div.input, div.input-prepend').each(function() {
            $(self).parent().removeClass('error');
            $(self).children('input, textarea, select').removeClass('error')
                .next('span.help-inline').remove();
        });

        this.$el.backdrop({}, function() {
            self.$el.spin();

            var data = {};
            _.each(self.$form.find(":input"), function(input) {
                if (input.name) data[input.name] = $(input).val();
            });

            if (typeof self.model === 'undefined') {
                self.model = new self.modelClass();
            }
            self.model.save(data, {
                success: function(model, response) {
                    self.$el.spin(false);
                    self.$el.backdrop();

                    $('<div class="alert-message success" data-alert="alert">' +
                      '<a class="close" href="#">×</a><p>Your post was successful!</p></div>')
                        .prependTo('#' + self.postType + '-submit-post')
                        .fadeOut(4000, function() {
                            $(this).remove();
                        });
                },
                error: function(model, response) {
                    self.$el.spin(false);
                    self.$el.backdrop();

                    $.each(response.errors, function(field, errors) {
                        var $input = $('#id_' + field);
                        $input.addClass('error').parent().parent().addClass('error');
                        $input.after('<span class="help-inline">' + errors.join(' ') + '</span>');
                    });
                }
            });
        });
    }

});
