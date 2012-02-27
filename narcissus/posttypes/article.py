from djangorestframework.resources import ModelResource

from narcissus.posttypes.base import BasePostType
from narcissus.models import ArticlePost


class ArticleResource(ModelResource):
    model = ArticlePost


class ArticlePostType(BasePostType):
    edit_template = 'narcissus/posts/article.html'
    model = ArticlePost
    resource = ArticleResource
