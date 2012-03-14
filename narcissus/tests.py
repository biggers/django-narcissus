from django.core.urlresolvers import reverse
from django.test import TestCase
from django.utils import simplejson as json

from narcissus.factories import UserFactory, UpdateFactory, ArticleFactory
from narcissus.posttypes import posttypes_json


class BaseTestCase(TestCase):
    common_fields = {
        'status': 1,
        'slug': 'slug',
        'language': 'en',
        'tags': '',
    }

    def setUp(self):
        self.user = UserFactory.create()

    def _authenticate(self):
        self.user.set_password('password')
        self.user.save()
        self.client.login(username=self.user.username, password='password')


class ViewsTestCase(BaseTestCase):

    def test_home_view(self):
        """
        Requests for the dashboard home should be successful and include the
        current post types in the context as JSON.
        """
        self._authenticate()
        response = self.client.get(reverse('narcissus-home'))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.context['post_types'], posttypes_json)

    def test_user_resource(self):
        """The fields returned for users should be very limited"""
        url = reverse('narcissus-user-detail', args=[self.user.pk])
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)

        data = json.loads(response.content)
        self.assertEqual(data.get('first_name'), self.user.first_name)
        self.assertEqual(data.get('last_name'), self.user.last_name)
        self.assertTrue(data.get('last_login') is not None)
        self.assertTrue(data.get('date_joined') is not None)
        self.assertEqual(data.get('username'), None)
        self.assertEqual(data.get('is_active'), None)
        self.assertEqual(data.get('is_superuser'), None)
        self.assertEqual(data.get('is_staff'), None)
        self.assertEqual(data.get('groups'), None)
        self.assertEqual(data.get('user_permissions'), None)
        self.assertEqual(data.get('password'), None)
        self.assertEqual(data.get('email'), None)


class UpdateTestCase(BaseTestCase):

    def test_model(self):
        """Test the methods on the model"""
        message = ("What I do, I do for the good of the universe. Something "
                    "you lost sight of thousands of years ago.")
        update = UpdateFactory.create(message=message)
        self.assertEqual(str(update),
                         "What I do, ...")
        self.assertEqual(update.get_teaser(), message)

    def test_unauthenticated(self):
        """Anonymous users should be denied write access"""
        url = reverse('narcissus-api-update')
        response = self.client.post(url, dict(self.common_fields,
            message="I'm a little teapot.",
        ))
        self.assertEqual(response.status_code, 403)

        update = UpdateFactory.create()
        url = reverse('narcissus-api-update-detail', args=[update.pk])
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)

        response = self.client.put(url, dict(self.common_fields,
            message="Short and stout.",
        ))
        self.assertEqual(response.status_code, 403)

        response = self.client.delete(url)
        self.assertEqual(response.status_code, 403)

    def test_unauthorized(self):
        """Users should only be able to update their own posts"""
        self._authenticate()

        update = UpdateFactory.create()

        url = reverse('narcissus-api-update-detail', args=[update.pk])
        response = self.client.put(url, dict(self.common_fields,
            message="I'm a little teapot.",
        ))
        self.assertEqual(response.status_code, 403)

        response = self.client.delete(url)
        self.assertEqual(response.status_code, 403)

    def test_create(self):
        self._authenticate()

        url = reverse('narcissus-api-update')
        response = self.client.post(url, dict(self.common_fields,
            message="I'm a little teapot.",
        ))
        self.assertEqual(response.status_code, 201)

        data = json.loads(response.content)
        self.assertEqual(data['message'], "I'm a little teapot.")
        self.assertEqual(data['posttype'], "updatepost")
        self.assertEqual(data['author']['first_name'], self.user.first_name)
        self.assertEqual(data['author']['last_name'], self.user.last_name)
        self.assertEqual(data['author'].get('username'), None)
        self.assertEqual(data['author'].get('password'), None)

    def test_read(self):
        self._authenticate()

        update = UpdateFactory.create(author=self.user)

        url = reverse('narcissus-api-update-detail', args=[update.pk])
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)

        data = json.loads(response.content)
        self.assertEqual(data['message'], update.message)
        self.assertEqual(data['author']['first_name'], self.user.first_name)
        self.assertEqual(data['author']['last_name'], self.user.last_name)
        self.assertEqual(data['author'].get('username'), None)
        self.assertEqual(data['author'].get('password'), None)

    def test_update(self):
        self._authenticate()

        update = UpdateFactory.create(author=self.user)

        url = reverse('narcissus-api-update-detail', args=[update.pk])
        response = self.client.put(url, dict(self.common_fields,
            message="Short and stout.",
        ))
        self.assertEqual(response.status_code, 200)

        data = json.loads(response.content)
        self.assertEqual(data['message'], "Short and stout.")
        self.assertEqual(data['author']['first_name'], self.user.first_name)
        self.assertEqual(data['author']['last_name'], self.user.last_name)
        self.assertEqual(data['author'].get('username'), None)
        self.assertEqual(data['author'].get('password'), None)

    def test_delete(self):
        self._authenticate()

        update = UpdateFactory.create(author=self.user)

        url = reverse('narcissus-api-update-detail', args=[update.pk])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, 204)

        response = self.client.get(url)
        self.assertEqual(response.status_code, 404)


class ArticleTestCase(BaseTestCase):

    def test_model(self):
        """Test the methods on the model"""
        content = (
            "# War of the Green Lanterns\n\n"
            "As _Sinestro_ fights _Krona_, a green power ring comes to him, "
            "making _Sinestro_ a **Green Lantern** once more."
        )
        rendered = (
            "<h1>War of the Green Lanterns</h1>\n<p>As <em>Sinestro</em> "
            "fights <em>Krona</em>, a green power ring comes to him, making "
            "<em>Sinestro</em> a <strong>Green Lantern</strong> once more.</p>"
        )
        article = ArticleFactory.create(content=content)

        self.assertEqual(article.rendered_content, rendered)
        self.assertEqual(article.word_count, 23)
        self.assertEqual(article.get_teaser(),
                         '<p>%s</p>' % article.description)

    def test_unauthenticated(self):
        """Anonymous users should be denied write access"""
        url = reverse('narcissus-api-article')
        response = self.client.post(url, dict(self.common_fields,
            title='Joe needs some soda',
            content="Joe's epic journey takes him through two worlds.",
        ))
        self.assertEqual(response.status_code, 403)

        article = ArticleFactory.create()
        url = reverse('narcissus-api-article-detail', args=[article.pk])
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)

        response = self.client.put(url, dict(self.common_fields,
            title='Joe drank some soda',
            content="Joe's epic journey takes him through two worlds.",
            markup="markdown",
        ))
        self.assertEqual(response.status_code, 403)

        response = self.client.delete(url)
        self.assertEqual(response.status_code, 403)

    def test_unauthorized(self):
        """Users should only be able to update their own posts"""
        self._authenticate()

        article = ArticleFactory.create()

        url = reverse('narcissus-api-article-detail', args=[article.pk])
        response = self.client.put(url, dict(self.common_fields,
            title='Joe drank some soda',
            content="Joe's epic journey takes him through two worlds.",
            markup="markdown",
        ))
        self.assertEqual(response.status_code, 403)

        response = self.client.delete(url)
        self.assertEqual(response.status_code, 403)

    def test_create(self):
        self._authenticate()

        url = reverse('narcissus-api-article')
        response = self.client.post(url, dict(self.common_fields,
            title='Joe needs some soda',
            content="Joe's epic journey takes him through two worlds.",
            markup="markdown",
        ))
        self.assertEqual(response.status_code, 201)

        data = json.loads(response.content)
        self.assertEqual(data['title'], "Joe needs some soda")
        self.assertEqual(data['content'], "Joe's epic journey takes him "
                                          "through two worlds.")
        self.assertEqual(data['posttype'], "articlepost")
        self.assertEqual(data['author']['first_name'], self.user.first_name)
        self.assertEqual(data['author']['last_name'], self.user.last_name)
        self.assertEqual(data['author'].get('username'), None)
        self.assertEqual(data['author'].get('password'), None)

    def test_read(self):
        self._authenticate()

        article = ArticleFactory.create(author=self.user)

        url = reverse('narcissus-api-article-detail', args=[article.pk])
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)

        data = json.loads(response.content)
        self.assertEqual(data['title'], article.title)
        self.assertEqual(data['content'], article.content)
        self.assertEqual(data['author']['first_name'], self.user.first_name)
        self.assertEqual(data['author']['last_name'], self.user.last_name)
        self.assertEqual(data['author'].get('username'), None)
        self.assertEqual(data['author'].get('password'), None)

    def test_update(self):
        self._authenticate()

        article = ArticleFactory.create(author=self.user)

        url = reverse('narcissus-api-article-detail', args=[article.pk])
        response = self.client.put(url, dict(self.common_fields,
            title='Joe drank some soda',
            content="Joe's epic journey takes him through two worlds.",
            markup="markdown",
        ))
        self.assertEqual(response.status_code, 200)

        data = json.loads(response.content)
        self.assertEqual(data['title'], "Joe drank some soda")
        self.assertEqual(data['content'], "Joe's epic journey takes him "
                                          "through two worlds.")
        self.assertEqual(data['author']['first_name'], self.user.first_name)
        self.assertEqual(data['author']['last_name'], self.user.last_name)
        self.assertEqual(data['author'].get('username'), None)
        self.assertEqual(data['author'].get('password'), None)

    def test_delete(self):
        self._authenticate()

        article = ArticleFactory.create(author=self.user)

        url = reverse('narcissus-api-article-detail', args=[article.pk])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, 204)

        response = self.client.get(url)
        self.assertEqual(response.status_code, 404)
