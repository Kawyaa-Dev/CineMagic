from django.contrib import admin
from .models import Booking

@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'show', 'total_price', 'status', 'booking_date')
    list_filter = ('status', 'booking_date')
    search_fields = ('user__username', 'payment_id')
    readonly_fields = ('booking_date',)