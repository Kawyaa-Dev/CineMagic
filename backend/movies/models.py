from django.db import models
from django.contrib.auth.models import User

class Movie(models.Model):
    GENRE_CHOICES = [
        ('ACTION', 'Action'),
        ('COMEDY', 'Comedy'),
        ('DRAMA', 'Drama'),
        ('HORROR', 'Horror'),
        ('ROMANCE', 'Romance'),
        ('SCI-FI', 'Sci-Fi'),
        ('THRILLER', 'Thriller'),
        ('ANIMATION', 'Animation'),
        ('DOCUMENTARY', 'Documentary'),
        ('FANTASY', 'Fantasy'),
        ('MYSTERY', 'Mystery'),
    ]
    
    title = models.CharField(max_length=200)
    description = models.TextField()
    genre = models.CharField(max_length=20, choices=GENRE_CHOICES)
    release_date = models.DateField()
    duration = models.IntegerField(help_text="Duration in minutes")
    language = models.CharField(max_length=50)
    poster_url = models.URLField(max_length=500)
    trailer_url = models.URLField(max_length=500, blank=True)
    rating = models.DecimalField(max_digits=3, decimal_places=1, default=0.0)
    is_featured = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # NEW FIELDS FOR MOVIE DETAILS
    director = models.CharField(max_length=200, blank=True, help_text="Movie director")
    cast = models.TextField(blank=True, help_text="Main cast members, comma separated")
    release_year = models.IntegerField(null=True, blank=True)
    age_rating = models.CharField(max_length=10, blank=True, help_text="e.g., PG-13, R, U/A")
    
    def __str__(self):
        return f"{self.title} ({self.release_date.year})"
    
    class Meta:
        ordering = ['-release_date']
        verbose_name = "Movie"
        verbose_name_plural = "Movies"

class Theater(models.Model):
    name = models.CharField(max_length=100)
    address = models.TextField()
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=50)
    pincode = models.CharField(max_length=10)
    total_screens = models.IntegerField(default=1)
    phone = models.CharField(max_length=20, blank=True)
    email = models.EmailField(blank=True)
    website = models.URLField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.name} - {self.city}"
    
    class Meta:
        verbose_name = "Theater"
        verbose_name_plural = "Theaters"

class Screen(models.Model):
    theater = models.ForeignKey(Theater, on_delete=models.CASCADE, related_name='screens')
    screen_number = models.IntegerField()
    capacity = models.IntegerField()
    seat_layout = models.JSONField(default=dict)
    
    def __str__(self):
        return f"{self.theater.name} - Screen {self.screen_number}"
    
    class Meta:
        unique_together = ['theater', 'screen_number']

class Show(models.Model):
    SHOW_TIMINGS = [
        ('MORNING', 'Morning (10:00 AM)'),
        ('AFTERNOON', 'Afternoon (1:00 PM)'),
        ('EVENING', 'Evening (4:00 PM)'),
        ('NIGHT', 'Night (7:00 PM)'),
        ('LATE_NIGHT', 'Late Night (10:00 PM)'),
    ]
    
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE, related_name='shows')
    screen = models.ForeignKey(Screen, on_delete=models.CASCADE, related_name='shows')
    show_time = models.CharField(max_length=20, choices=SHOW_TIMINGS)
    show_date = models.DateField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    available_seats = models.IntegerField()
    booked_seats = models.JSONField(default=list)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.movie.title} - {self.show_time} - {self.show_date}"
    
    class Meta:
        ordering = ['show_date', 'show_time']