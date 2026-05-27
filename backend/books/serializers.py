from rest_framework import serializers
from .models import Book


class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = [
            'id', 'title', 'author', 'category', 'isbn',
            'quantity', 'available_quantity', 'description',
            'image', 'thumbnail', 'published_date',
        ]
        read_only_fields = ['id', 'available_quantity']

    def validate_quantity(self, value):
        if value < 0:
            raise serializers.ValidationError('Quantity cannot be negative.')
        return value
