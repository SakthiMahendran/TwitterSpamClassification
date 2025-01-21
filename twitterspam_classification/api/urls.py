from django.urls import path
from .views import SignUpView, LoginView, ClassifyView

urlpatterns = [
    path('signup/', SignUpView.as_view(), name='signup'),
    path('login/', LoginView.as_view(), name='login'),
    path('classify/', ClassifyView.as_view(), name='classify'),
]
