Narcissus.PostType = Backbone.Model.extend({

    initialize: function() {
        _.bindAll(this, 'toString', 'getView', 'getModel', '_resolveAttribute');
    },

    toString: function() {
        return this.get('title');
    },

    getView: function() {
        /* Get the view that this PostType uses */
        return this._resolveAttribute('view');
    },

    getModel: function() {
        /* Get the view that this PostType uses */
        return this._resolveAttribute('model');
    },

    _resolveAttribute: function(attr) {
        /*
         * Resolve a string attribute on the PostType into an actual
         * JavaScript class. This feels hacky and inflexible, but it's safer
         * than eval().
         */
        var Class = window;
        _.each(this.get(attr).split('.'), function(newAttr) {
            Class = Class[newAttr];
        });
        return Class;
    }

});


Narcissus.PostTypeCollection = Backbone.Collection.extend({
    model: Narcissus.PostType,

    getFromName: function(posttype_name) {
        return this.find(function(postType) {
            return postType.get('posttype_name') == posttype_name;
        }, this);

    }
});


Narcissus.PostCollection = Backbone.Collection.extend({

    _prepareModel: function(model, options) {
        /*
         * Instead of relying on this.model, use the appropriate postType
         * model.
         */
        options || (options = {});
        if (!(model instanceof Backbone.Model)) {
            var modelPostType, Model, attrs = model;
            options.collection = this;
            modelPostType = Narcissus.postTypes.getFromName(model['posttype']);
            Model = modelPostType.getModel();
            model = new Model(attrs, options);
            if (!model._validate(model.attributes, options)) model = false;
        } else if (!model.collection) {
            model.collection = this;
        }
        return model;
    }

});


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

            var data = {}, created = false;
            _.each(self.$form.find(":input"), function(input) {
                if (input.name) data[input.name] = $(input).val();
            });

            if (typeof self.model === 'undefined') {
                self.model = new self.modelClass();
                created = true;
            }
            self.model.save(data, {
                success: function(model, response) {
                    self.$el.spin(false);
                    self.$el.backdrop();

                    if (created) Narcissus.posts.add(self.model, {at: 0});

                    $('<div class="alert alert-success fade in">' +
                      '<a class="close" data-dismiss="alert">×</a>' +
                      'Your post was successful!</div>')
                        .prependTo('#submit-post');

                    setTimeout(function() {
                        $('.alert-success').alert('close');
                    }, 4000);

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
