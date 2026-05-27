from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenRefreshView

from .models import User
from .serializers import (
    UserSerializer, ProfileSerializer, RegisterSerializer, LoginSerializer, TokenResponseSerializer
)


class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response(
            TokenResponseSerializer.get_tokens_for_user(user),
            status=status.HTTP_201_CREATED,
        )


class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data
        return Response(TokenResponseSerializer.get_tokens_for_user(user))


class LogoutView(APIView):
    def post(self, request):
        try:
            refresh_token = request.data.get('refresh')
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()
        except Exception:
            pass
        return Response({'detail': 'Logged out.'})


class ProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = ProfileSerializer

    def get_object(self):
        return self.request.user


class UserListView(generics.ListAPIView):
    """Librarian-only: list all student users."""
    serializer_class = UserSerializer

    def get_queryset(self):
        if self.request.user.role != 'librarian':
            return User.objects.none()
        return User.objects.filter(role='student').order_by('name')


class UserDetailView(generics.RetrieveUpdateAPIView):
    """Librarian-only: view / suspend / activate a student."""
    serializer_class = UserSerializer
    queryset = User.objects.all()

    def get_queryset(self):
        if self.request.user.role != 'librarian':
            return User.objects.none()
        return User.objects.all()
