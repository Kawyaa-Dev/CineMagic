from rest_framework import serializers
from .models import Booking
from movies.serializers import ShowSerializer

class BookingSerializer(serializers.ModelSerializer):
    show_detail = ShowSerializer(source='show', read_only=True)
    user_email = serializers.EmailField(source='user.email', read_only=True)
    
    class Meta:
        model = Booking
        fields = ['id', 'user', 'user_email', 'show', 'show_detail', 
                 'seats', 'total_price', 'booking_date', 'status', 'payment_id']