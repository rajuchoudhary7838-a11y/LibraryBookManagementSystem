from django.urls import path

from .views import (
    BookRequestListCreateView,
    BookRequestDetailView
)

urlpatterns = [
    path('', BookRequestListCreateView.as_view()),
    path('<uuid:pk>/', BookRequestDetailView.as_view()),
]