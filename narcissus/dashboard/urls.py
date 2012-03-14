from django.conf import settings
from django.conf.urls.defaults import patterns, include, url

from djangorestframework import permissions
from djangorestframework.views import ListOrCreateModelView, InstanceModelView

from narcissus.dashboard.views import HomeView, SameUserOrReadOnly
from narcissus.posttypes import posttypes
from narcissus.posttypes.base import UserResource
from narcissus.settings import STATIC_URL


urlpatterns = patterns('',
    url(r'^login/$', 'django.contrib.auth.views.login',
        kwargs={'template_name': 'narcissus/dashboard/login.html',
                'extra_context': {'NARCISSUS_STATIC_URL': STATIC_URL}},
        name='narcissus-login'),
    url(r'^logout/$', 'django.contrib.auth.views.logout',
        kwargs={'template_name': 'narcissus/dashboard/logged_out.html',
                'extra_context': {'NARCISSUS_STATIC_URL': STATIC_URL,
                                  'LOGIN_URL': settings.LOGIN_URL}},
        name='narcissus-logout'),
    url(r'^(?:(?P<path>.+)?)/?$', HomeView.as_view(), name='narcissus-home'),
)


def add_narcissus_urls(urls):
    urls += patterns('',
        url(r'^dashboard/', include('narcissus.dashboard.urls')),
        url(r'^api/user/(?P<pk>[^/]+)/$', InstanceModelView.as_view(
            resource=UserResource, permissions=(SameUserOrReadOnly,),
        ), name='narcissus-user-detail'),
    )
    for name, posttype in posttypes.items():
        urls += patterns('',
            url(r'^api/%s/$' % name,
                ListOrCreateModelView.as_view(
                    resource=posttype.resource,
                    permissions=(permissions.IsUserOrIsAnonReadOnly,),
                ),
                name='narcissus-api-%s' % name),
            url(r'^api/%s/(?P<pk>[^/]+)/$' % name,
                InstanceModelView.as_view(
                    resource=posttype.resource,
                    permissions=(SameUserOrReadOnly,),
                ),
                name='narcissus-api-%s-detail' % name),
        )
    return urls
