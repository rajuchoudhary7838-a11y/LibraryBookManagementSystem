from rest_framework import serializers
from .models import BookRequest


class BookRequestSerializer(serializers.ModelSerializer):
    student_id = serializers.UUIDField(source='student.id', read_only=True)
    student_name = serializers.CharField(source='student.name', read_only=True)

    book_id = serializers.UUIDField(source='book.id', read_only=True)
    book_title = serializers.CharField(source='book.title', read_only=True)
    book_thumbnail = serializers.CharField(source='book.thumbnail', read_only=True)

    class Meta:
        model = BookRequest
        fields = [
            'id',
            'student_id',
            'student_name',
            'book_id',
            'book_title',
            'book_thumbnail',
            'status',
            'request_date',
            'approved_date',
            'due_date',
            'return_date',
        ]

        read_only_fields = [
            'id',
            'student_id',
            'student_name',
            'book_id',
            'book_title',
            'book_thumbnail',
            'status',
            'request_date',
            'approved_date',
            'due_date',
            'return_date',
        ]


class CreateRequestSerializer(serializers.Serializer):
    book_id = serializers.UUIDField()

    def validate_book_id(self, value):
        from books.models import Book

        try:
            book = Book.objects.get(id=value)
        except Book.DoesNotExist:
            raise serializers.ValidationError('Book not found.')

        if book.available_quantity <= 0:
            raise serializers.ValidationError('No copies available.')

        return value

    def validate(self, data):
        request = self.context['request']
        user = request.user
        book_id = data['book_id']

        existing = BookRequest.objects.filter(
            student=user,
            book_id=book_id,
            status__in=['pending', 'approved']
        ).exists()

        if existing:
            raise serializers.ValidationError(
                'You already have an active request for this book.'
            )

        return data


class UpdateRequestSerializer(serializers.Serializer):
    status = serializers.ChoiceField(
        choices=['approved', 'declined', 'returned']
    )