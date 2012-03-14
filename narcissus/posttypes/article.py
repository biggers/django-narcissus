from narcissus.posttypes.base import BaseResource, BasePostType
from narcissus.models import ArticlePost


class ArticleResource(BaseResource):
    model = ArticlePost

    def __init__(self, *args, **kwargs):
        self.fields += ('title', 'content', 'description', 'markup')
        super(ArticleResource, self).__init__(*args, **kwargs)


class ArticlePostType(BasePostType):
    title = "Article"
    model = ArticlePost
    resource = ArticleResource
    backbone_model = 'Narcissus.Article'
    backbone_view = 'Narcissus.ArticleView'
