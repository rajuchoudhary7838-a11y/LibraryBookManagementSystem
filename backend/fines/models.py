from django.db import models
from django.conf import settings
import uuid


class Fine(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    student = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='fines',
    )
    book_request = models.OneToOneField(
        'requests_app.BookRequest',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='fine',
    )
    amount = models.DecimalField(max_digits=6, decimal_places=2)
    status = models.CharField(
        max_length=10,
        choices=[('pending', 'Pending'), ('paid', 'Paid')],
        default='pending',
    )
    reason = models.CharField(max_length=200, default='Overdue book')
    created_at = models.DateTimeField(auto_now_add=True)
    payment_date = models.DateField(null=True, blank=True)

    class Meta:
        db_table = 'fines'
        ordering = ['-created_at']

    def __str__(self):
        return f'Fine ${self.amount} — {self.student.name} [{self.status}]'
