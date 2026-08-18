from django.test import TestCase
from django.contrib.auth.models import User
from django.conf import settings
import stripe

class PaymentTestCase(TestCase):
    def test_stripe_key_exists(self):
        self.assertIsNotNone(settings.STRIPE_SECRET_KEY)
        self.assertIsNotNone(settings.STRIPE_PUBLISHABLE_KEY)