from djangorestframework.resources import ModelResource


class BaseResource(ModelResource):
    model = None  # The model the form should be based on
    allow_unknown_form_fields = True

    def validate_request(self, data, files=None):
        """Automatically populate the author and posttype"""
        data['author'] = self.view.request.user.id
        data['posttype'] = self.model._meta.module_name
        return super(BaseResource, self).validate_request(data, files)


class BasePostType(object):
    """
    PostType objects describe how the dashboard handles a particular post type.
    """
    model = None  # The model represented by the PostType.
    resource = None  # The API resource for the model

    backbone_model = None  # The Backbone.js model used by the PostType
    backbone_view = None  # The Backbone.js view used by the PostType

    def __init__(self, instance=None):
        # A post instance, used when displaying a post on the dashboard.
        self.instance = instance

    @classmethod
    def get_verbose_name(cls):
        """Convenience method to make it easy to retrieve the verbose name"""
        return str(cls.model._meta.verbose_name)

    @classmethod
    def get_verbose_name_plural(cls):
        """Convenience method to make it easy to retrieve the plural name"""
        return str(cls.model._meta.verbose_name_plural)
