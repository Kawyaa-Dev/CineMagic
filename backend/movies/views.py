from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.db import transaction
from django.utils import timezone
from django_filters.rest_framework import DjangoFilterBackend
from .models import Movie, Theater, Screen, Show
from .serializers import (
    MovieSerializer, TheaterSerializer, ScreenSerializer, ShowSerializer
)
from bookings.models import Booking
from bookings.serializers import BookingSerializer

class MovieViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Movie.objects.all()
    serializer_class = MovieSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['genre', 'language', 'release_date']
    search_fields = ['title', 'description']
    ordering_fields = ['rating', 'release_date', 'title']
    
    @action(detail=False, methods=['get'])
    def featured(self, request):
        featured_movies = Movie.objects.filter(is_featured=True)
        serializer = self.get_serializer(featured_movies, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def now_showing(self, request):
        today = timezone.now().date()
        movies = Movie.objects.filter(shows__show_date__gte=today).distinct()
        serializer = self.get_serializer(movies, many=True)
        return Response(serializer.data)

class TheaterViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Theater.objects.all()
    serializer_class = TheaterSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    search_fields = ['name', 'city', 'state']

class ScreenViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Screen.objects.all()
    serializer_class = ScreenSerializer
    permission_classes = [AllowAny]

# ✅ ✅ ✅ COMPLETE FIX - NO FILTERING AT ALL
class ShowViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = ShowSerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        """
        ✅ Return ALL shows - NO filtering whatsoever
        This overrides any default filtering
        """
        # Start with ALL shows
        queryset = Show.objects.all()
        
        # ✅ ONLY filter by movie_id if explicitly provided
        movie_id = self.request.query_params.get('movie')
        if movie_id:
            try:
                queryset = queryset.filter(movie_id=int(movie_id))
            except ValueError:
                pass
        
        # ✅ FORCE: Remove any default ordering that might filter
        # ✅ Return ALL shows, including past and future
        return queryset
    
    # ✅ Override list method to ensure no extra filtering
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def book_seats(self, request, pk=None):
        show = self.get_object()
        seats = request.data.get('seats', [])
        
        if not seats:
            return Response(
                {'error': 'Please select at least one seat'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if len(seats) > 10:
            return Response(
                {'error': 'Cannot book more than 10 seats at once'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        booked_seats = set(show.booked_seats)
        requested_seats = set(seats)
        
        if requested_seats.intersection(booked_seats):
            return Response(
                {'error': 'Some seats are already booked'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if len(requested_seats) > show.available_seats:
            return Response(
                {'error': 'Not enough seats available'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        with transaction.atomic():
            booking = Booking.objects.create(
                user=request.user,
                show=show,
                seats=list(requested_seats),
                total_price=show.price * len(requested_seats),
                status='PENDING'
            )
            
            show.booked_seats.extend(list(requested_seats))
            show.available_seats -= len(requested_seats)
            show.save()
            
            serializer = BookingSerializer(booking)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    @action(detail=True, methods=['get'])
    def available_seats(self, request, pk=None):
        show = self.get_object()
        total_seats = show.screen.capacity
        booked_seats = set(show.booked_seats)
        available_seats = [str(i) for i in range(1, total_seats + 1) if str(i) not in booked_seats]
        return Response({
            'total_seats': total_seats,
            'booked_seats': list(booked_seats),
            'available_seats': available_seats,
            'available_count': len(available_seats)
        })