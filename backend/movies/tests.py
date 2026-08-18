from django.test import TestCase
from .models import Movie

class MovieTestCase(TestCase):
    def test_movie_creation(self):
        movie = Movie.objects.create(
            title="Test Movie",
            genre="ACTION",
            duration=120,
            language="English"
        )
        self.assertEqual(movie.title, "Test Movie")