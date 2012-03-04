from djangorestframework.resources import ModelResource

from narcissus.posttypes.base import BasePostType
from narcissus.models import ArticlePost


class ArticleResource(ModelResource):
    model = ArticlePost


class ArticlePostType(BasePostType):
    model = ArticlePost
    resource = ArticleResource
    backbone_model = 'Narcissus.Article'
    backbone_view = 'Narcissus.ArticleView'
