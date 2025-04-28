from django.urls import include, path

from rest_framework import routers
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from . import views

router = routers.DefaultRouter()
router.register(r'users', views.UserViewSet)
router.register(r'parking_spots', views.ParkingSpotViewSet)
router.register(r'pricing', views.PricingViewSet)
router.register(r'booking', views.BookingViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
    path('api-auth/', include('rest_framework.urls')),
    path('api/token/', TokenObtainPairView.as_view(),
         name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(),
         name='token_refresh'),
    path('api/user/', views.CurrentUserView.as_view()),
    path('api/register/', views.RegisterView.as_view(), name='register'),
    path('api/profile/', views.EditProfileView.as_view(), name='edit-profile'),

]
