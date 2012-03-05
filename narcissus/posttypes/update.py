from djangorestframework.resources import ModelResource

from narcissus.posttypes.base import BasePostType
from narcissus.models import UpdatePost


class UpdateResource(ModelResource):
    model = UpdatePost


class UpdatePostType(BasePostType):
    title = 'Status Update'
    model = UpdatePost
    resource = UpdateResource
    backbone_model = 'Narcissus.Update'
    backbone_view = 'Narcissus.UpdateView'
