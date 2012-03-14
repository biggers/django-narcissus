import datetime

from django.contrib.auth.models import User
from django.template.defaultfilters import slugify

import factory

from narcissus.models import UpdatePost, ArticlePost


class UserFactory(factory.DjangoModelFactory):
    """Taken from https://github.com/votizen/django-factory_boy"""
    FACTORY_FOR = User

    username = factory.Sequence(lambda n: "username%s" % n)
    first_name = factory.Sequence(lambda n: "first_name%s" % n)
    last_name = factory.Sequence(lambda n: "last_name%s" % n)
    email = factory.Sequence(lambda n: "email%s@example.com" % n)
    password = 'sha1$caffc$30d78063d8f2a5725f60bae2aca64e48804272c3'
    is_staff = False
    is_active = True
    is_superuser = False
    last_login = datetime.datetime(2000, 1, 1)
    date_joined = datetime.datetime(1999, 1, 1)


class UpdateFactory(factory.DjangoModelFactory):
    FACTORY_FOR = UpdatePost

    author = factory.SubFactory(UserFactory)
    message = factory.Sequence(lambda n: "message%s" % n)
    slug = factory.LazyAttribute(lambda u: slugify(u.message))


class ArticleFactory(factory.DjangoModelFactory):
    FACTORY_FOR = ArticlePost

    author = factory.SubFactory(UserFactory)
    title = factory.Sequence(lambda n: "title%s" % n)
    content = factory.Sequence(lambda n: "content%s" % n)
    description = factory.Sequence(lambda n: "description%s" % n)
    markup = "markdown"
    slug = factory.LazyAttribute(lambda a: slugify(a.title))
