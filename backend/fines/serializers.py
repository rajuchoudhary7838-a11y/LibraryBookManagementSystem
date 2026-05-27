from rest_framework import serializers
from .models import Fine


class FineSerializer(serializers.ModelSerializer):
    student_id = serializers.UUIDField(source='student.id', read_only=True)
    student_name = serializers.CharField(source='student.name', read_only=True)

    class Meta:
        model = Fine
        fields = ['id', 'student_id', 'student_name', 'amount', 'status', 'reason', 'payment_date', 'created_at']
        read_only_fields = ['id', 'student_id', 'student_name', 'amount', 'reason', 'created_at']
