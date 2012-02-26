Narcissus.PostView = Backbone.View.extend({
    initialize: function (options) {
        _.bindAll(this, 'render', 'renderUrl', 'submitPost');

        this.postType = options.postType;
        this.$form = $('#' + this.postType + '-form');
        this.$urlInput = $('#id_' + self.postType + '_slug');
        this.$urlValue = $(options.urlValue);

        this.events = {};
        this.events[options.urlValue + ' keyup'] = 'renderUrl';
        this.events[options.urlValue + ' keydown'] = 'renderUrl';
        this.events['#' + this.$form.attr('id') + ' submit'] = 'submitPost';

        this.render();
    },

    render: function() {
        var currentWidth = this.$urlInput.width();
        var prependWidth = this.$urlInput.prev('.add-on').outerWidth();
        this.$urlInput.width(currentWidth - prependWidth);
    },

    renderUrl: function() {
        this.$url_input.val(URLify($url_value.val(), 50));
    },

    submitPost: function() {
        /*
         * Not yet converted to the Backbone-based structure
         */

        var self = this;

        self.clear_errors();

        self.$form.backdrop({}, function() {
            self.$form.spin();

            $.ajax({
                type: 'POST',
                url: self.$form.attr('action'),
                data: self.$form.serialize(),
                success: function(data) {
                    self.$form.spin(false);
                    self.$form.backdrop();

                    if (data.success) {
                        self.valid_form(data);
                    } else {
                        self.invalid_form(data);
                    }
                },
                error: function(data) {
                    self.$form.spin(false);
                    self.$form.backdrop();
                },
                dataType: 'json'
            });
        });

        return false;
    },

    valid_form: function(data) {
        /*
         * Not yet converted to the Backbone-based structure
         */
        var self = this;

        $('<div class="alert-message success" data-alert="alert">' +
          '<a class="close" href="#">×</a><p>Your post was successful!</p></div>')
            .prependTo('#' + self.postType + '-submit-post')
            .fadeOut(4000, function() {
                $(this).remove();
            });
    },

    invalid_form: function(data) {
        /*
         * Not yet converted to the Backbone-based structure
         */
        var self = this;

        $.each(data.errors, function(field, errors) {
            $input = $('#id_' + self.postType + '_' + field);
            $input.addClass('error').parent().parent().addClass('error');
            $input.after('<span class="help-inline">' + errors.join(' ') + '</span>');
        });
    },

    clear_errors: function(data) {
        /*
         * Not yet converted to the Backbone-based structure
         */
        var self = this;

        $('div.input, div.input-prepend').each(function() {
            $(self).parent().removeClass('error');
            $(self).children('input, textarea, select').removeClass('error')
                .next('span.help-inline').remove();
        });
    }
});
