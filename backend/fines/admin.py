from django.contrib import admin
from .models import Fine


@admin.register(Fine)
class FineAdmin(admin.ModelAdmin):
    list_display = ['student', 'amount', 'status', 'reason', 'created_at', 'payment_date']
    list_filter = ['status']
    search_fields = ['student__name']
