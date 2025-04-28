from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password

from rest_framework import serializers

from .models import ParkingSpot, Pricing, Booking

User = get_user_model()


class PricingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pricing
        fields = ['spot_type', 'price_per_hour']


class ParkingSpotSerializer(serializers.ModelSerializer):
    pricing = PricingSerializer()

    class Meta:
        model = ParkingSpot
        fields = ['id', 'spot_number', 'is_available', 'pricing']

    def create(self, validated_data):
        pricing_data = validated_data.pop('pricing')
        pricing = Pricing.objects.create(**pricing_data)
        parking_spot = ParkingSpot.objects.create(
            pricing=pricing, **validated_data)
        return parking_spot

    def update(self, instance, validated_data):
        pricing_data = validated_data.pop('pricing', None)

        # Update spot fields
        instance.spot_number = validated_data.get(
            'spot_number', instance.spot_number)
        instance.is_available = validated_data.get(
            'is_available', instance.is_available)
        instance.save()

        # Update related pricing fields if they exist
        if pricing_data:
            pricing = instance.pricing
            pricing.spot_type = pricing_data.get(
                'spot_type', pricing.spot_type)
            pricing.price_per_hour = pricing_data.get(
                'price_per_hour', pricing.price_per_hour)
            pricing.save()

        return instance


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ['email', 'first_name', 'last_name', 'password', 'password2']

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError(
                {"password": "Passwords didn't match."})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password2')
        user = User.objects.create_user(**validated_data)
        return user


class EditProfileSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email', 'password']
        extra_kwargs = {
            'first_name': {'required': False},
            'last_name': {'required': False},
            'email': {'required': True},
        }

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        if password:
            instance.set_password(password)

        instance.save()
        return instance


class UsersSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'email', 'is_staff']
        read_only_fields = ['id']

    def create(self, validated_data):
        # Create user without password, since the password is handled separately
        user = User(**validated_data)
        user.set_password(validated_data.get('password'))
        user.save()
        return user

    def update(self, instance, validated_data):
        instance.username = validated_data.get('username', instance.username)
        instance.email = validated_data.get('email', instance.email)
        instance.role = validated_data.get('role', instance.role)

        password = validated_data.get('password')
        if password:
            instance.set_password(password)

        instance.save()
        return instance


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'is_staff']


class BookingSerializer(serializers.HyperlinkedModelSerializer):
    user = serializers.ReadOnlyField(source='user.username')
    spot_detail = ParkingSpotSerializer(source='spot', read_only=True)

    class Meta:
        model = Booking
        fields = ['url', 'user', 'spot', 'spot_detail', 'start_time',
                  'end_time', 'created_at', 'status']
        extra_kwargs = {
            'status': {'read_only': True}
        }

    def update(self, instance, validated_data):
        request = self.context.get('request')

        new_status = request.data.get('status')
        if new_status == 'cancelled' and instance.status in ['pending', 'confirmed']:
            instance.status = 'cancelled'
            instance.save()
            instance.spot.is_available = True
            instance.spot.save()
        else:
            for attr, value in validated_data.items():
                setattr(instance, attr, value)
            instance.save()

        return instance
