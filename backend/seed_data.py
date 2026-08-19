import os
import django
from datetime import date, timedelta, datetime

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'cinemagic_api.settings')
django.setup()

from movies.models import Movie, Theater, Screen, Show

def seed_database():
    print("🎬 SEEDING DATABASE...")
    
    Show.objects.all().delete()
    Screen.objects.all().delete()
    Theater.objects.all().delete()
    Movie.objects.all().delete()
    print("✅ Cleared all data")
    
    movies_data = [
        {
            'title': 'Dune: Part Two',
            'description': 'Paul Atreides continues his journey on Arrakis.',
            'genre': 'SCI-FI',
            'release_date': date.today() + timedelta(days=5),
            'duration': 166,
            'language': 'English',
            'poster_url': '/media/posters/dune.jpg',
            'rating': 8.5,
            'is_featured': True,
            'director': 'Denis Villeneuve',
            'cast': 'Timothée Chalamet, Zendaya, Rebecca Ferguson',
            'release_year': 2024,
            'age_rating': 'PG-13'
        },
        {
            'title': 'The Batman',
            'description': 'Batman investigates corruption.',
            'genre': 'ACTION',
            'release_date': date.today() + timedelta(days=10),
            'duration': 175,
            'language': 'English',
            'poster_url': '/media/posters/batman.jpg',
            'rating': 8.2,
            'is_featured': True,
            'director': 'Matt Reeves',
            'cast': 'Robert Pattinson, Zoë Kravitz, Paul Dano',
            'release_year': 2022,
            'age_rating': 'PG-13'
        },
        {
            'title': 'Inside Out 2',
            'description': 'Riley navigates new emotions.',
            'genre': 'COMEDY',
            'release_date': date.today() + timedelta(days=3),
            'duration': 100,
            'language': 'English',
            'poster_url': '/media/posters/insideout.jpg',
            'rating': 7.9,
            'is_featured': False,
            'director': 'Kelsey Mann',
            'cast': 'Amy Poehler, Maya Hawke, Kensington Tallman',
            'release_year': 2024,
            'age_rating': 'PG'
        },
        {
            'title': 'Interstellar',
            'description': 'A team of explorers save humanity.',
            'genre': 'SCI-FI',
            'release_date': date.today() - timedelta(days=30),
            'duration': 169,
            'language': 'English',
            'poster_url': '/media/posters/interstellar.jpg',
            'rating': 9.0,
            'is_featured': True,
            'director': 'Christopher Nolan',
            'cast': 'Matthew McConaughey, Anne Hathaway, Jessica Chastain',
            'release_year': 2014,
            'age_rating': 'PG-13'
        },
        {
            'title': 'Avatar: The Way of Water',
            'description': 'Jake Sully protects his family.',
            'genre': 'SCI-FI',
            'release_date': date.today() + timedelta(days=15),
            'duration': 192,
            'language': 'English',
            'poster_url': '/media/posters/avatar.jpg',
            'rating': 7.8,
            'is_featured': False,
            'director': 'James Cameron',
            'cast': 'Sam Worthington, Zoe Saldana, Sigourney Weaver',
            'release_year': 2022,
            'age_rating': 'PG-13'
        },
        {
            'title': 'Deadpool & Wolverine',
            'description': 'Deadpool teams up with Wolverine.',
            'genre': 'ACTION',
            'release_date': date.today() + timedelta(days=20),
            'duration': 120,
            'language': 'English',
            'poster_url': '/media/posters/deadpool.jpg',
            'rating': 8.0,
            'is_featured': True,
            'director': 'Shawn Levy',
            'cast': 'Ryan Reynolds, Hugh Jackman, Emma Corrin',
            'release_year': 2024,
            'age_rating': 'R'
        }
    ]
    
    created_movies = []
    for movie_data in movies_data:
        movie = Movie.objects.create(**movie_data)
        created_movies.append(movie)
        print(f"✅ Created movie: {movie.title}")
    
    theater = Theater.objects.create(
        name='CineMagic Premium Cinema',
        address='123 Cinema Lane',
        city='New York',
        state='NY',
        pincode='10001',
        total_screens=1
    )
    print(f"✅ Theater: {theater.name}")
    
    screen = Screen.objects.create(
        theater=theater,
        screen_number=1,
        capacity=100,
        seat_layout={'rows': 10, 'cols': 10}
    )
    print(f"✅ Screen 1")
    
    show_times = [
        ('MORNING', 150, 10),
        ('AFTERNOON', 170, 13),
        ('EVENING', 190, 16),
        ('NIGHT', 210, 19),
        ('LATE_NIGHT', 230, 22),
    ]
    
    today = date.today()
    dates = [
        today,
        today + timedelta(days=1),
        today + timedelta(days=2),
        today + timedelta(days=3),
    ]
    
    current_hour = datetime.now().hour
    show_count = 0
    
    for movie in created_movies:
        for d in dates:
            for show_time, price, hour in show_times:
                if d == today and hour <= current_hour:
                    continue
                
                booked = []
                available = 100
                if show_time in ['EVENING', 'NIGHT'] and d in [today, today + timedelta(days=1)]:
                    booked = ['A1','A2','A3','A4','A5','B1','B2','B3','B4','B5','C1','C2','C3','C4','C5']
                    available = 85
                
                Show.objects.create(
                    movie=movie,
                    screen=screen,
                    show_time=show_time,
                    show_date=d,
                    price=price,
                    available_seats=available,
                    booked_seats=booked
                )
                show_count += 1
    
    print(f"\n🎉 SEEDING COMPLETE!")
    print(f"📽️ Movies: {Movie.objects.count()}")
    print(f"🎟️ Shows: {Show.objects.count()}")

if __name__ == '__main__':
    seed_database()