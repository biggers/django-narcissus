Narcissus.PostView = Backbone.View.extend({
    initialize: function (options) {
        _.bindAll(this, 'render', 'renderUrl', 'submitPost');

        this.posttype = options.posttype;
        this.$form = $(options.formSelector);
        this.$urlInput = $('#id_' + self.posttype + '_slug');
        this.$urlValue = $(options.urlValue);

        this.events = {};
        this.events[options.urlValue + ' keyup'] = 'renderUrl';
        this.events[options.urlValue + ' keydown'] = 'renderUrl';
        this.events[options.formSelector + ' submit'] = 'submitPost';

        this.render();
    },

    render: function() {
        var currentWidth = $urlInput.width();
        var prependWidth = $urlInput.prev('.add-on').outerWidth();
        $urlInput.width(currentWidth - prependWidth);
    },

    renderUrl: function() {
        $url_input.val(URLify($url_value.val(), 50));
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
            .prependTo('#' + self.posttype + '-submit-post')
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
            $input = $('#id_' + self.posttype + '_' + field);
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

Narcissus.UpdateView = Narcissus.PostView.extend({
    $statusElement: $('#status_count'),

    initialize: function(options) {
        Narcissus.PostView.prototype.initialize.call(this, options);
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