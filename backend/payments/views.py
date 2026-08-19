from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.conf import settings
import stripe
from bookings.models import Booking

stripe.api_key = settings.STRIPE_SECRET_KEY

class CreatePaymentIntentView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        booking_id = request.data.get('booking_id')
        amount = request.data.get('amount')  # This is in rupees
        
        try:
            booking = Booking.objects.get(id=booking_id, user=request.user)
            
            # ✅ Convert rupees to paise/cents for Stripe
            final_amount = int(amount * 100)
            
            intent = stripe.PaymentIntent.create(
                amount=final_amount,
                currency='usd',
                metadata={
                    'booking_id': booking.id,
                    'user_id': request.user.id,
                    'screen_type': request.data.get('screen_type', '2D')
                },
            )
            
            return Response({
                'client_secret': intent.client_secret,
                'payment_intent_id': intent.id,
                'booking_id': booking.id
            })
            
        except Booking.DoesNotExist:
            return Response({'error': 'Booking not found'}, status=404)
        except Exception as e:
            return Response({'error': str(e)}, status=400)

class ConfirmPaymentView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        payment_intent_id = request.data.get('payment_intent_id')
        booking_id = request.data.get('booking_id')
        final_amount = request.data.get('final_amount')  # This is in rupees
        
        try:
            intent = stripe.PaymentIntent.retrieve(payment_intent_id)
            
            if intent.status == 'succeeded':
                booking = Booking.objects.get(id=booking_id, user=request.user)
                booking.status = 'CONFIRMED'
                booking.payment_id = payment_intent_id
                
                # ✅ final_amount is already in rupees
                if final_amount:
                    booking.total_price = final_amount
                else:
                    booking.total_price = intent.amount / 100
                
                booking.save()
                
                return Response({
                    'success': True,
                    'booking': booking.id,
                    'amount': booking.total_price,
                    'message': 'Payment successful!'
                })
            else:
                return Response({
                    'success': False,
                    'message': 'Payment not completed'
                }, status=400)
                
        except Exception as e:
            return Response({'error': str(e)}, status=400)