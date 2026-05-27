from rest_framework import generics, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Book
from .serializers import BookSerializer


class IsLibrarianOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            # allow read-only access (GET/HEAD/OPTIONS) to anonymous users
            return True
        return request.user and request.user.is_authenticated and request.user.role == 'librarian'


class BookListCreateView(generics.ListCreateAPIView):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    permission_classes = [IsLibrarianOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category']
    search_fields = ['title', 'author', 'isbn', 'description']
    ordering_fields = ['title', 'author', 'created_at']
    ordering = ['title']


class BookDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    permission_classes = [IsLibrarianOrReadOnly]

    def perform_update(self, serializer):
        instance = self.get_object()
        new_quantity = serializer.validated_data.get('quantity', instance.quantity)
        diff = new_quantity - instance.quantity
        new_available = max(0, instance.available_quantity + diff)
        serializer.save(available_quantity=new_available)
