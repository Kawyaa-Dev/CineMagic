from django.test import TestCase
from django.contrib.auth.models import User
from .models import Booking
from movies.models import Movie, Theater, Screen, Show

class BookingTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpass')
        self.movie = Movie.objects.create(title='Test Movie', duration=120, language='English')
        self.theater = Theater.objects.create(name='Test Theater', total_screens=1)
        self.screen = Screen.objects.create(theater=self.theater, screen_number=1, capacity=50)
        self.show = Show.objects.create(
            movie=self.movie,
            screen=self.screen,
            show_time='EVENING',
            price=150.00,
            available_seats=50
        )
    
    def test_booking_creation(self):
        booking = Booking.objects.create(
            user=self.user,
            show=self.show,
            seats=['A1', 'A2'],
            total_price=300.00,
            status='PENDING'
        )
        self.assertEqual(booking.total_price, 300.00)