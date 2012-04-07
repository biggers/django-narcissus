from narcissus.posttypes.base import BaseResource, BasePostType
from narcissus.models import ArticlePost


class ArticleResource(BaseResource):
    model = ArticlePost

    def __init__(self, *args, **kwargs):
        self.fields += ('title', 'content', 'description', 'markup')
        super(ArticleResource, self).__init__(*args, **kwargs)

    def serialize(self, obj):
        """Add the markup choices to the serialized model"""
        serialized = super(ArticleResource, self).serialize(obj)

        markup_choices = obj._meta.get_field_by_name('markup')[0].choices
        serialized['markup_choices'] = markup_choices

        return serialized


class ArticlePostType(BasePostType):
    title = "Article"
    model = ArticlePost
    resource = ArticleResource
    backbone_model = 'Narcissus.Article'
    backbone_view = 'Narcissus.ArticleView'
