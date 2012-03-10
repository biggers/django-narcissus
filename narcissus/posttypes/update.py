from narcissus.posttypes.base import BaseResource, BasePostType
from narcissus.models import UpdatePost


class UpdateResource(BaseResource):
    model = UpdatePost


class UpdatePostType(BasePostType):
    title = 'Status Update'
    model = UpdatePost
    resource = UpdateResource
    backbone_model = 'Narcissus.Update'
    backbone_view = 'Narcissus.UpdateView'
