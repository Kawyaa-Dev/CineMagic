import os
import django
from datetime import date, timedelta, datetime

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'cinemagic_api.settings')
django.setup()

from movies.models import Movie, Theater, Screen, Show

def seed_database():
    print("🎬 SEEDING DATABASE WITH 4 FULL DAYS...")
    
    # Clear everything
    Show.objects.all().delete()
    Screen.objects.all().delete()
    Theater.objects.all().delete()
    Movie.objects.all().delete()
    print("✅ Cleared all data")
    
    # MOVIES WITH WORKING POSTER URLS
    movies_data = [
        {
            'title': 'Dune: Part Two',
            'description': 'Paul Atreides continues his journey on Arrakis.',
            'genre': 'SCI-FI',
            'release_date': date.today() + timedelta(days=5),
            'duration': 166,
            'language': 'English',
            'poster_url': 'https://image.tmdb.org/t/p/w500/8b8r8IjVw5qDcZ1iPzA2cBkKtEe.jpg',
            'rating': 8.5,
            'is_featured': True,
            'director': 'Denis Villeneuve',
            'cast': 'Timothée Chalamet, Zendaya, Rebecca Ferguson',
            'release_year': 2024,
            'age_rating': 'PG-13'
        },
        {
            'title': 'The Batman',
            'description': 'Batman investigates corruption in Gotham City.',
            'genre': 'ACTION',
            'release_date': date.today() + timedelta(days=10),
            'duration': 175,
            'language': 'English',
            'poster_url': 'https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg',
            'rating': 8.2,
            'is_featured': True,
            'director': 'Matt Reeves',
            'cast': 'Robert Pattinson, Zoë Kravitz, Paul Dano',
            'release_year': 2022,
            'age_rating': 'PG-13'
        },
        {
            'title': 'Inside Out 2',
            'description': 'Riley navigates new emotions as a teenager.',
            'genre': 'COMEDY',
            'release_date': date.today() + timedelta(days=3),
            'duration': 100,
            'language': 'English',
            'poster_url': 'https://image.tmdb.org/t/p/w500/ox4o1TgxBXaEA5VvI3CC4r0PlHx.jpg',
            'rating': 7.9,
            'is_featured': False,
            'director': 'Kelsey Mann',
            'cast': 'Amy Poehler, Maya Hawke, Kensington Tallman',
            'release_year': 2024,
            'age_rating': 'PG'
        },
        {
            'title': 'Interstellar',
            'description': 'A team of explorers travel through a wormhole to save humanity.',
            'genre': 'SCI-FI',
            'release_date': date.today() - timedelta(days=30),
            'duration': 169,
            'language': 'English',
            'poster_url': 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
            'rating': 9.0,
            'is_featured': True,
            'director': 'Christopher Nolan',
            'cast': 'Matthew McConaughey, Anne Hathaway, Jessica Chastain',
            'release_year': 2014,
            'age_rating': 'PG-13'
        },
        {
            'title': 'Avatar: The Way of Water',
            'description': 'Jake Sully protects his family on Pandora.',
            'genre': 'SCI-FI',
            'release_date': date.today() + timedelta(days=15),
            'duration': 192,
            'language': 'English',
            'poster_url': 'https://image.tmdb.org/t/p/w500/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg',
            'rating': 7.8,
            'is_featured': False,
            'director': 'James Cameron',
            'cast': 'Sam Worthington, Zoe Saldana, Sigourney Weaver',
            'release_year': 2022,
            'age_rating': 'PG-13'
        }
    ]
    
    created_movies = []
    for movie_data in movies_data:
        movie = Movie.objects.create(**movie_data)
        created_movies.append(movie)
        print(f"✅ Movie: {movie.title}")
    
    # Theater
    theater = Theater.objects.create(
        name='CineMagic Premium Cinema',
        address='123 Cinema Lane',
        city='New York',
        state='NY',
        pincode='10001',
        total_screens=1
    )
    print(f"✅ Theater: {theater.name}")
    
    # Screen
    screen = Screen.objects.create(
        theater=theater,
        screen_number=1,
        capacity=100,
        seat_layout={'rows': 10, 'cols': 10}
    )
    print(f"✅ Screen 1")
    
    # Showtimes with pricing
    show_times = [
        ('MORNING', 150),
        ('AFTERNOON', 170),
        ('EVENING', 190),
        ('NIGHT', 210),
        ('LATE_NIGHT', 230),
    ]
    
    # ✅ 4 DAYS: Today, Tomorrow, +2, +3
    today = date.today()
    show_dates = [
        today,
        today + timedelta(days=1),
        today + timedelta(days=2),
        today + timedelta(days=3),
    ]
    
    print("\n📅 Creating shows for these dates:")
    for d in show_dates:
        print(f"   ✅ {d}")
    
    total_shows = 0
    
    # ✅ Create shows for ALL movies on ALL dates with ALL showtimes
    for movie in created_movies:
        for d in show_dates:
            for show_time, price in show_times:
                # ✅ ONLY skip if it's today AND time has passed
                if d == today:
                    time_map = {'MORNING': 10, 'AFTERNOON': 13, 'EVENING': 16, 'NIGHT': 19, 'LATE_NIGHT': 22}
                    current_hour = datetime.now().hour
                    if time_map[show_time] <= current_hour:
                        continue
                
                # Some shows have less seats (Filling Fast)
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
                total_shows += 1
    
    print(f"\n✅ Created {total_shows} shows!")
    print(f"\n📊 FINAL SUMMARY:")
    print(f"   Movies: {Movie.objects.count()}")
    print(f"   Shows: {Show.objects.count()}")
    print(f"\n📅 Shows by date:")
    for d in show_dates:
        count = Show.objects.filter(show_date=d).count()
        print(f"   {d}: {count} shows")
    
    print("\n🎉 SEEDING COMPLETE!")

if __name__ == '__main__':
    seed_database()