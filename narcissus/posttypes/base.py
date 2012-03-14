from django.contrib.auth.models import User
from djangorestframework.resources import ModelResource
from narcissus.utils.time import to_epoch


class UserResource(ModelResource):
    model = User
    fields = ('first_name', 'last_name', 'get_last_login', 'get_date_joined')
    rename = {'get_last_login': 'last_login',
              'get_date_joined': 'date_joined'}

    def get_last_login(self, instance):
        return to_epoch(instance.last_login)

    def get_date_joined(self, instance):
        return to_epoch(instance.date_joined)


class BaseResource(ModelResource):
    model = None  # The model the form should be based on
    fields = ('posttype', 'status', ('author', UserResource), 'language',
              'slug', 'get_created_date', 'get_updated_date', 'get_teaser')
    rename = {'get_created_date': 'created_date',
              'get_updated_date': 'updated_date',
              'get_teaser': 'teaser'}
    allow_unknown_form_fields = True

    def validate_request(self, data, files=None):
        """Automatically populate the author and posttype"""
        data['author'] = self.view.request.user.id
        data['posttype'] = self.model._meta.module_name
        return super(BaseResource, self).validate_request(data, files)

    def get_created_date(self, instance):
        return to_epoch(instance.created_date)

    def get_updated_date(self, instance):
        return to_epoch(instance.updated_date)


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
