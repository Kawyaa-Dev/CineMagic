from rest_framework import serializers
from .models import Movie, Theater, Screen, Show

class MovieSerializer(serializers.ModelSerializer):
    class Meta:
        model = Movie
        fields = '__all__'

class TheaterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Theater
        fields = '__all__'

class ScreenSerializer(serializers.ModelSerializer):
    class Meta:
        model = Screen
        fields = '__all__'

class ShowSerializer(serializers.ModelSerializer):
    movie_detail = MovieSerializer(source='movie', read_only=True)
    screen_detail = ScreenSerializer(source='screen', read_only=True)
    
    class Meta:
        model = Show
        fields = ['id', 'movie', 'movie_detail', 'screen', 'screen_detail', 
                 'show_time', 'show_date', 'price', 'available_seats', 'booked_seats']