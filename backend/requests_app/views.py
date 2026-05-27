from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import BookRequest
from .serializers import (
    BookRequestSerializer,
    CreateRequestSerializer,
    UpdateRequestSerializer
)


class BookRequestListCreateView(APIView):

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):

        user = request.user

        if user.role == 'librarian':

            qs = BookRequest.objects.select_related(
                'student',
                'book'
            ).all()

        else:

            qs = BookRequest.objects.select_related(
                'student',
                'book'
            ).filter(student=user)

        serializer = BookRequestSerializer(qs, many=True)

        return Response(serializer.data)

    def post(self, request):

        if request.user.role != 'student':

            return Response(
                {'detail': 'Only students can create requests.'},
                status=403
            )

        serializer = CreateRequestSerializer(
            data=request.data,
            context={'request': request}
        )

        serializer.is_valid(raise_exception=True)

        from books.models import Book

        book = Book.objects.get(
            id=serializer.validated_data['book_id']
        )

        req = BookRequest.objects.create(
            student=request.user,
            book=book,
        )

        return Response(
            BookRequestSerializer(req).data,
            status=status.HTTP_201_CREATED
        )


class BookRequestDetailView(APIView):

    permission_classes = [permissions.IsAuthenticated]

    def get_object(self, pk, user):

        try:

            req = BookRequest.objects.select_related(
                'student',
                'book'
            ).get(pk=pk)

        except BookRequest.DoesNotExist:
            return None

        if user.role != 'librarian' and req.student != user:
            return None

        return req

    def patch(self, request, pk):

        req = self.get_object(pk, request.user)

        if req is None:

            return Response(
                {'detail': 'Not found.'},
                status=404
            )

        serializer = UpdateRequestSerializer(
            data=request.data
        )

        serializer.is_valid(raise_exception=True)

        new_status = serializer.validated_data['status']

        # APPROVE
        if new_status == 'approved':

            if request.user.role != 'librarian':

                return Response(
                    {'detail': 'Only librarians can approve requests.'},
                    status=403
                )

            if req.status != 'pending':

                return Response(
                    {'detail': 'Only pending requests can be approved.'},
                    status=400
                )

            try:
                req.approve()

            except ValueError as exc:

                return Response(
                    {'detail': str(exc)},
                    status=400
                )

        # DECLINE
        elif new_status == 'declined':

            if request.user.role != 'librarian':

                return Response(
                    {'detail': 'Only librarians can decline requests.'},
                    status=403
                )

            if req.status != 'pending':

                return Response(
                    {'detail': 'Only pending requests can be declined.'},
                    status=400
                )

            req.status = 'declined'
            req.save()

        # RETURNED
        elif new_status == 'returned':

            if request.user.role != 'librarian':

                return Response(
                    {'detail': 'Only librarians can mark returned.'},
                    status=403
                )

            if req.status != 'approved':

                return Response(
                    {'detail': 'Only approved books can be returned.'},
                    status=400
                )

            try:
                req.mark_returned()

            except ValueError as exc:

                return Response(
                    {'detail': str(exc)},
                    status=400
                )

        return Response(
            BookRequestSerializer(req).data
        )

    def delete(self, request, pk):

        req = self.get_object(pk, request.user)

        if req is None:

            return Response(
                {'detail': 'Not found.'},
                status=404
            )

        if request.user.role != 'student':

            return Response(
                {'detail': 'Only students can cancel requests.'},
                status=403
            )

        if req.status != 'pending':

            return Response(
                {'detail': 'Only pending requests can be cancelled.'},
                status=400
            )

        req.delete()

        return Response(
            status=status.HTTP_204_NO_CONTENT
        )