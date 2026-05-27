from django.db import models
from django.conf import settings
from django.db import transaction
from django.db.models import Q
from datetime import date, timedelta
import uuid


class BookRequest(models.Model):

    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('declined', 'Declined'),
        ('returned', 'Returned'),
    ]

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False
    )

    student = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='requests',
        limit_choices_to={'role': 'student'},
    )

    book = models.ForeignKey(
        'books.Book',
        on_delete=models.CASCADE,
        related_name='requests'
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending'
    )

    request_date = models.DateField(auto_now_add=True)

    approved_date = models.DateField(
        null=True,
        blank=True
    )

    due_date = models.DateField(
        null=True,
        blank=True
    )

    return_date = models.DateField(
        null=True,
        blank=True
    )

    class Meta:
        db_table = 'book_requests'

        ordering = ['-request_date']

        constraints = [
            models.UniqueConstraint(
                fields=['student', 'book'],
                condition=Q(status='approved'),
                name='unique_approved_book_per_student'
            )
        ]

    def __str__(self):
        return f'{self.student.name} → {self.book.title} [{self.status}]'

    def approve(self):
        from books.models import Book

        with transaction.atomic():

            book = Book.objects.select_for_update().get(
                id=self.book.id
            )

            if book.available_quantity <= 0:
                raise ValueError(
                    'No copies available to approve this request.'
                )

            self.status = 'approved'
            self.approved_date = date.today()
            self.due_date = date.today() + timedelta(days=14)

            self.save()

            book.available_quantity -= 1
            book.save()

    def mark_returned(self):
        from fines.models import Fine

        with transaction.atomic():

            if self.status != 'approved':
                raise ValueError(
                    'Only approved books can be returned.'
                )

            self.status = 'returned'
            self.return_date = date.today()

            self.save()

            book = self.book
            book.available_quantity += 1
            book.save()

            # Generate fine if overdue
            if self.due_date and date.today() > self.due_date:

                overdue_days = (
                    date.today() - self.due_date
                ).days

                fine_amount = min(overdue_days * 1.00, 25.00)

                Fine.objects.get_or_create(
                    student=self.student,
                    book_request=self,
                    defaults={
                        'amount': fine_amount,
                        'reason': f'Overdue by {overdue_days} day(s)',
                    }
                )