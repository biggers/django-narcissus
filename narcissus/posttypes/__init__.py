import json

from django.conf import settings
from django.core.exceptions import ImproperlyConfigured
from django.utils.datastructures import SortedDict
from django.utils.importlib import import_module

from narcissus.settings import POSTTYPES

# Cache of posttype classes.
_narcissus_posttypes = None


def _get_posttypes():
    global _narcissus_posttypes
    if _narcissus_posttypes is None:
        posttypes = []
        for path in POSTTYPES:
            i = path.rfind('.')
            module, attr = path[:i], path[i+1:]
            try:
                mod = import_module(module)
            except ImportError, e:
                raise ImproperlyConfigured(
                    'Error importing narcissus posttype module %s: "%s"'
                    % (module, e)
                )
            try:
                posttype = getattr(mod, attr)
            except AttributeError:
                raise ImproperlyConfigured(
                    'Module "%s" does not define a "%s" posttype class'
                    % (module, attr)
                )
            # Structure it in a tuple that will be converted to a dict using
            # the verbose names of the posttypes as keys.
            posttypes.append((posttype.get_verbose_name(), posttype))
        _narcissus_posttypes = SortedDict(posttypes)
    return _narcissus_posttypes


def _get_posttypes_json():
    """Get the JSON needed to construct Backbone models"""
    posttype_dicts = []
    for name, posttype in _get_posttypes().items():
        posttype_dicts.append({
            'name': name,
            # Used to look up PostTypes from Post.posttype attributes
            'posttype_name': posttype.model._meta.module_name,
            'title': posttype.title,
            'model': posttype.backbone_model,
            'view': posttype.backbone_view,
            'verbose_name': posttype.get_verbose_name(),
            'verbose_name_plural': posttype.get_verbose_name_plural(),
            'extra_details': posttype.extra_details,
        })
    return json.dumps(posttype_dicts)


posttypes = _get_posttypes()
posttypes_json = _get_posttypes_json()
