from django.contrib.auth import get_user_model
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import generics
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.utils import timezone
from .models import ParkingSpot, Booking
from rest_framework import status as http_status

from rest_framework import permissions, viewsets

from . import serializers
from .models import ParkingSpot, Pricing, Booking
from .permissions import IsOwner

User = get_user_model()


class RegisterView(generics.CreateAPIView):
    permission_classes = [permissions.AllowAny]
    queryset = User.objects.all()
    serializer_class = serializers.RegisterSerializer

    def post(self, request):
        data = request.data
        if data['password'] != data['password2']:
            return Response({'password': ['Passwords do not match.']}, status=400)
        user = User.objects.create_user(
            email=data['email'], password=data['password'], first_name=data['first_name'], last_name=data['last_name'])
        return Response({'message': 'User created'}, status=201)


class EditProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = serializers.EditProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user


class CurrentUserView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = serializers.UserSerializer(request.user)
        return Response(serializer.data)


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = serializers.UsersSerializer
    permission_classes = []

    def get_permissions(self):
        if self.action == 'create':  # Registration
            return [permissions.AllowAny()]
        if self.action == 'list':  # Admin view
            return [permissions.IsAuthenticated(), permissions.IsAdminUser()]
        if self.action == 'retrieve':
            return [permissions.IsAuthenticated()]
        return [permissions.IsAuthenticated()]


class ParkingSpotViewSet(viewsets.ModelViewSet):
    queryset = ParkingSpot.objects.all()
    serializer_class = serializers.ParkingSpotSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_permissions(self):
        if self.action == 'create':  # Registration
            return [permissions.IsAdminUser()]
        if self.action == 'list':  # Admin view
            return [permissions.IsAuthenticated()]
        if self.action == 'retrieve':
            return [permissions.IsAuthenticated()]
        return [permissions.IsAdminUser()]


class PricingViewSet(viewsets.ModelViewSet):
    queryset = Pricing.objects.all()
    serializer_class = serializers.PricingSerializer


class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.none()
    serializer_class = serializers.BookingSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwner]

    def get_queryset(self):
        if self.request.user.is_staff:
            return Booking.objects.all()
        return Booking.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class UpdateStatus(APIView):
    def post(self, request, spotname):
        status_value = request.data.get('status')
        print(status_value)
        if status_value is None:
            return JsonResponse(
                {'error': 'Missing "is_available" in request data.'},
                status=http_status.HTTP_400_BAD_REQUEST
            )

        # Convert to boolean
        if isinstance(status_value, str):
            status_value = status_value.lower() == 'no_object'

        print(status_value)
        # Get the ParkingSpot
        spot = get_object_or_404(ParkingSpot, spot_number=spotname)

        # Update is_available status
        spot.is_available = status_value
        spot.save()

        # Optionally update any active booking if status is True (spot is freed)
        if status_value:
            active_bookings = Booking.objects.filter(
                spot=spot,
                end_time__gt=timezone.now(),
                status='confirmed'
            )
            for booking in active_bookings:
                booking.status = 'cancelled'
                booking.save()

        return JsonResponse({
            'spot': spot.spot_number,
            'is_available': spot.is_available,
            'message': 'Spot availability updated successfully.'
        })
