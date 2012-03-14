from narcissus.posttypes.base import BaseResource, BasePostType
from narcissus.models import UpdatePost


class UpdateResource(BaseResource):
    model = UpdatePost

    def __init__(self, *args, **kwargs):
        self.fields += ('message',)
        super(UpdateResource, self).__init__(*args, **kwargs)


class UpdatePostType(BasePostType):
    title = 'Status Update'
    model = UpdatePost
    resource = UpdateResource
    backbone_model = 'Narcissus.Update'
    backbone_view = 'Narcissus.UpdateView'
