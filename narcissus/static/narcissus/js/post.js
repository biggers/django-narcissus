Narcissus.PostView = Backbone.View.extend({

    initialize: function(options) {
        _.bindAll(this, 'render', 'renderUrl', 'submitPost');

        this.postType = options.postType;
        this.$urlInput = $('#id_' + this.postType + '_slug');
        this.$urlValue = $(options.urlValue);

        this.events = {};
        this.events['keyup ' + options.urlValue] = 'renderUrl';
        this.events['keydown ' + options.urlValue] = 'renderUrl';
        this.events['submit #' + this.$el.attr('id')] = 'submitPost';

        var currentWidth = this.$urlInput.width();
        var prependWidth = this.$urlInput.prev('.add-on').outerWidth();
        this.$urlInput.width(currentWidth - prependWidth);
    },

    renderUrl: function(event) {
        this.$urlInput.val(URLify(this.$urlValue.val(), 50));
    },

    submitPost: function(event) {
        var self = this;
        event.preventDefault();

        $('div.input, div.input-prepend').each(function() {
            $(self).parent().removeClass('error');
            $(self).children('input, textarea, select').removeClass('error')
                .next('span.help-inline').remove();
        });

        this.$el.backdrop({}, function() {
            self.$el.spin();

            if (typeof self.model === 'undefined') {
                self.model = new self.modelClass(self.$el.serialize());
            }
            self.model.save({}, {
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
                        var $input = $('#id_' + self.postType + '_' + field);
                        $input.addClass('error').parent().parent().addClass('error');
                        $input.after('<span class="help-inline">' + errors.join(' ') + '</span>');
                    });
                }
            });
        });
    }

});
