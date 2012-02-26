var DashboardForm = Class.$extend({

  __init__ : function(posttype, form_selector, url_value) {
    var self = this;

    self.posttype = posttype;
    self.$form = $(form_selector);
    self.$form.submit(function(e) {
      self.submit();
      return false;
    });

    if (url_value) {
      var $url_input = $('#id_' + self.posttype + '_slug');
      var current_width = $url_input.width();
      var prepend_width = $url_input.prev('.add-on').outerWidth();
      $url_input.width(current_width - prepend_width);

      $(url_value).bind('keyup keydown', function() {
        $url_input.val(URLify($(this).val(), 50));
      });
    }
  },

  submit: function() {
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
    var self = this;

    $('<div class="alert-message success" data-alert="alert">' +
      '<a class="close" href="#">×</a><p>Your post was successful!</p></div>')
        .prependTo('#' + self.posttype + '-submit-post')
        .fadeOut(4000, function() {
          $(this).remove();
        });
  },

  invalid_form: function(data) {
    var self = this;

    $.each(data.errors, function(field, errors) {
      $input = $('#id_' + self.posttype + '_' + field);
      $input.addClass('error').parent().parent().addClass('error');
      $input.after('<span class="help-inline">' + errors.join(' ') + '</span>');
    });
  },

  clear_errors: function(data) {
    var self = this;

    $('div.input, div.input-prepend').each(function() {
      $(self).parent().removeClass('error');
      $(self).children('input, textarea, select').removeClass('error')
        .next('span.help-inline').remove();
    });
  },

});
