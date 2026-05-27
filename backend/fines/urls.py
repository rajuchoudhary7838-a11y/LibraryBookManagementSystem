from django.urls import path
from .views import FineListView, FineDetailView

urlpatterns = [
    path('', FineListView.as_view()),
    path('<uuid:pk>/', FineDetailView.as_view()),
]
