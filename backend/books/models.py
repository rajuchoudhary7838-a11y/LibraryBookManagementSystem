from django.db import models
import uuid


class Book(models.Model):
    CATEGORY_CHOICES = [
        ('Fiction', 'Fiction'),
        ('Non-Fiction', 'Non-Fiction'),
        ('Science', 'Science'),
        ('Technology', 'Technology'),
        ('History', 'History'),
        ('Biography', 'Biography'),
        ('Philosophy', 'Philosophy'),
        ('Self-Help', 'Self-Help'),
        ('Mystery', 'Mystery'),
        ('Fantasy', 'Fantasy'),
        ('Romance', 'Romance'),
        ('Horror', 'Horror'),
        ('Children', 'Children'),
        ('Education', 'Education'),
        ('Art', 'Art'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=300)
    author = models.CharField(max_length=200)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    isbn = models.CharField(max_length=20, blank=True)
    quantity = models.PositiveIntegerField(default=1)
    available_quantity = models.PositiveIntegerField(default=1)
    description = models.TextField(blank=True)
    image = models.URLField(blank=True)
    thumbnail = models.URLField(blank=True)
    published_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'books'
        ordering = ['title']

    def __str__(self):
        return f'{self.title} by {self.author}'

    def save(self, *args, **kwargs):
        # Keep thumbnail in sync with image when not explicitly set
        if self.image and not self.thumbnail:
            self.thumbnail = self.image
        super().save(*args, **kwargs)
