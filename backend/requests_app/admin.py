from django.contrib import admin
from .models import BookRequest


@admin.register(BookRequest)
class BookRequestAdmin(admin.ModelAdmin):
    list_display = ['student', 'book', 'status', 'request_date', 'due_date']
    list_filter = ['status', 'request_type']
    search_fields = ['student__name', 'book__title']
    date_hierarchy = 'request_date'
