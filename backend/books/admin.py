from django.contrib import admin
from .models import Book


@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
    list_display = ['title', 'author', 'category', 'quantity', 'available_quantity']
    list_filter = ['category']
    search_fields = ['title', 'author', 'isbn']
