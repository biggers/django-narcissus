from django.conf import settings
from django.views.generic import TemplateView
from django.utils import simplejson as json

from djangorestframework import permissions

from narcissus.posttypes import posttypes, posttypes_json
from narcissus.models import BasePost
from narcissus.settings import STATIC_URL
from narcissus.utils.views import LoginRequiredMixin


class HomeView(LoginRequiredMixin, TemplateView):
    template_name = "narcissus/dashboard/base.html"

    def get_context_data(self, path=None, **kwargs):
        posts = []
        for base_post in BasePost.objects.all():
            # Get the actual type-specific post object using the multi-table
            # child accessor
            post = getattr(base_post, base_post.posttype)
            resource = posttypes[str(post._meta.verbose_name)].resource()
            post_dict = resource.serialize(post)
            posts.append(post_dict)

        context = super(HomeView, self).get_context_data(**kwargs)
        context.update({
            'NARCISSUS_STATIC_URL': STATIC_URL,
            'LOGOUT_URL': settings.LOGOUT_URL,
            'user': self.request.user,
            'post_types': posttypes_json,
            'posts': json.dumps(posts),
        })
        return context


class SameUserOrReadOnly(permissions.BasePermission):
    """
    The request is authenticated as the user that owns the post, or is a
    read-only request.
    """

    def check_permission(self, user):
        if self.view.method not in permissions.SAFE_METHODS:
            instance = self.view.get_instance()
            if hasattr(instance, 'username'):
                instance_user = instance
            else:
                instance_user = getattr(instance, 'author', None)
            if user != instance_user:
                raise permissions._403_FORBIDDEN_RESPONSE
