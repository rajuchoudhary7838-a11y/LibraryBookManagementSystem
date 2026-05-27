from datetime import date
from django.db.models import Sum
from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from books.models import Book
from accounts.models import User
from requests_app.models import BookRequest
from fines.models import Fine


class StatsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        if request.user.role != 'librarian':
            return Response({'detail': 'Librarians only.'}, status=403)

        today = date.today()
        pending_fines = Fine.objects.filter(status='pending').aggregate(total=Sum('amount'))['total']

        data = {
            'total_books': Book.objects.count(),
            'total_users': User.objects.filter(role='student').count(),
            'pending_requests': BookRequest.objects.filter(status='pending').count(),
            'active_loans': BookRequest.objects.filter(status='approved').count(),
            'overdue_loans': BookRequest.objects.filter(status='approved', due_date__lt=today).count(),
            'total_fines_pending': float(pending_fines or 0),
        }
        return Response(data)
