from django.contrib import admin
from .models import Movie, Theater, Screen, Show

@admin.register(Movie)
class MovieAdmin(admin.ModelAdmin):
    list_display = ('title', 'genre', 'release_date', 'rating', 'is_featured')
    list_filter = ('genre', 'language', 'is_featured')
    search_fields = ('title', 'description')

@admin.register(Theater)
class TheaterAdmin(admin.ModelAdmin):
    list_display = ('name', 'city', 'state', 'total_screens')
    search_fields = ('name', 'city')

@admin.register(Screen)
class ScreenAdmin(admin.ModelAdmin):
    list_display = ('theater', 'screen_number', 'capacity')

@admin.register(Show)
class ShowAdmin(admin.ModelAdmin):
    list_display = ('movie', 'screen', 'show_time', 'show_date', 'price', 'available_seats')
    list_filter = ('show_time', 'show_date', 'movie')
    search_fields = ('movie__title',)