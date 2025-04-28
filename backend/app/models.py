from django.db import models
from django.utils import timezone
from django.core.exceptions import ValidationError
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager


class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('Email must be provided')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=255, blank=True)
    last_name = models.CharField(max_length=255, blank=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = CustomUserManager()

    def __str__(self):
        return self.email


class Pricing(models.Model):
    spot_type = models.CharField(max_length=50, choices=[(
        'regular', 'Regular'), ('vip', 'VIP')], default='regular')
    price_per_hour = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"Pricing for {self.spot_type}"

    def calculate_price(self, duration_in_hours, is_daily=False):
        return self.price_per_hour * duration_in_hours


class ParkingSpot(models.Model):
    pricing = models.ForeignKey(
        Pricing, on_delete=models.CASCADE, related_name="spots")
    spot_number = models.CharField(max_length=20)
    is_available = models.BooleanField(default=True)

    def __str__(self):
        return f"Spot {self.spot_number}"


class Booking(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('cancelled', 'Cancelled'),
        ('expired', 'Expired'),
    ]
    user = models.ForeignKey(
        'app.user', related_name="booking", on_delete=models.CASCADE)
    spot = models.ForeignKey(ParkingSpot, on_delete=models.CASCADE)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(
        max_length=10, choices=STATUS_CHOICES, default='pending')

    class Meta:
        unique_together = ('spot', 'start_time', 'end_time')

    @property
    def duration(self):
        return (self.end_time - self.start_time).total_seconds() / 3600

    def save(self, *args, **kwargs):
        now = timezone.now()

        if self.start_time < now:
            raise ValidationError("Start time cannot be in the past.")

        if self.end_time <= self.start_time:
            raise ValidationError("End time must be after the start time.")

        conflicts = Booking.objects.filter(
            spot=self.spot,
            status__in=['pending', 'confirmed'],  # ignore cancelled
        ).exclude(pk=self.pk).filter(
            start_time__lt=self.end_time,
            end_time__gt=self.start_time,
        )

        if conflicts.exists():
            raise ValidationError(
                "This parking spot is already booked for the selected time.")

        if self.spot.is_available:
            self.status = 'confirmed'

        super().save(*args, **kwargs)

        if self.status == 'confirmed':
            self.spot.is_available = False
            self.spot.save()
        elif self.status == 'cancelled':
            self.spot.is_available = True
            self.spot.save()

    def auto_unbook(self):
        if self.end_time < timezone.now() and self.status == 'pending':
            self.status = 'cancelled'
            self.save()
            self.spot.is_available = True
            self.spot.save()

    def __str__(self):
        return f"Booking by {self.user.username} for Spot {self.spot.spot_number}"
