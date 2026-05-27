from datetime import date
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Fine
from .serializers import FineSerializer


class FineListView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        if user.role == 'librarian':
            fines = Fine.objects.select_related('student').all()
        else:
            fines = Fine.objects.select_related('student').filter(student=user)
        return Response(FineSerializer(fines, many=True).data)


class FineDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self, pk, user):
        try:
            fine = Fine.objects.get(pk=pk)
        except Fine.DoesNotExist:
            return None
        if user.role != 'librarian' and fine.student != user:
            return None
        return fine

    def patch(self, request, pk):
        fine = self.get_object(pk, request.user)
        if fine is None:
            return Response({'detail': 'Not found.'}, status=404)
        if fine.status == 'paid':
            return Response({'detail': 'Fine is already paid.'}, status=400)
        fine.status = 'paid'
        fine.payment_date = date.today()
        fine.save()
        return Response(FineSerializer(fine).data)
