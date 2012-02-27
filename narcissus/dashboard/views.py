from django.conf import settings
from django.views.generic import TemplateView

from narcissus.posttypes import posttypes
from narcissus.models import BasePost
from narcissus.settings import STATIC_URL
from narcissus.utils.views import LoginRequiredMixin


class HomeView(LoginRequiredMixin, TemplateView):
    template_name = "narcissus/dashboard/home.html"

    def get_context_data(self, **kwargs):
        for name, posttype in posttypes.items():
            # Annotate each posttype with an instance of the form that has
            # auto_id populated.
            form_class = posttype.get_form_class()
            posttype.form_instance = form_class(auto_id="id_%s_%%s" % name)

        posts = []
        for base_post in BasePost.objects.all():
            # Get the actual type-specific post object using the multi-table
            # child accessor
            posts.append(getattr(base_post, base_post.posttype))

        context = super(HomeView, self).get_context_data(**kwargs)
        context.update({
            'NARCISSUS_STATIC_URL': STATIC_URL,
            'LOGOUT_URL': settings.LOGOUT_URL,
            'user': self.request.user,
            'posttypes': posttypes,
            'posts': posts,
        })
        return context
