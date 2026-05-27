from django.core.management.base import BaseCommand
from django.db import transaction


BOOKS_DATA = [
    {
        'title': 'The Great Gatsby',
        'author': 'F. Scott Fitzgerald',
        'category': 'Fiction',
        'isbn': '978-0-7432-7356-5',
        'quantity': 5,
        'description': 'A story of the fabulously wealthy Jay Gatsby and his love for the beautiful Daisy Buchanan.',
        'image': 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400',
        'published_date': '1925-04-10',
    },
    {
        'title': 'To Kill a Mockingbird',
        'author': 'Harper Lee',
        'category': 'Fiction',
        'isbn': '978-0-06-112008-4',
        'quantity': 4,
        'description': 'The story of racial injustice and the loss of innocence in the American South.',
        'image': 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400',
        'published_date': '1960-07-11',
    },
    {
        'title': 'A Brief History of Time',
        'author': 'Stephen Hawking',
        'category': 'Science',
        'isbn': '978-0-553-38016-3',
        'quantity': 3,
        'description': 'Hawking explores the cosmos, from the Big Bang to black holes, in accessible language.',
        'image': 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=400',
        'published_date': '1988-03-01',
    },
    {
        'title': 'Clean Code',
        'author': 'Robert C. Martin',
        'category': 'Technology',
        'isbn': '978-0-13-235088-4',
        'quantity': 6,
        'description': 'A handbook of agile software craftsmanship — essential reading for every programmer.',
        'image': 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=400',
        'published_date': '2008-08-11',
    },
    {
        'title': 'Sapiens: A Brief History of Humankind',
        'author': 'Yuval Noah Harari',
        'category': 'History',
        'isbn': '978-0-06-231609-7',
        'quantity': 4,
        'description': 'Explores the history of humankind from the Stone Age to the modern era.',
        'image': 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400',
        'published_date': '2011-01-01',
    },
    {
        'title': 'The Alchemist',
        'author': 'Paulo Coelho',
        'category': 'Fiction',
        'isbn': '978-0-06-112241-5',
        'quantity': 5,
        'description': 'A philosophical novel about a young Andalusian shepherd on a journey to find treasure.',
        'image': 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400',
        'published_date': '1988-01-01',
    },
    {
        'title': 'Atomic Habits',
        'author': 'James Clear',
        'category': 'Self-Help',
        'isbn': '978-0-7352-1129-2',
        'quantity': 5,
        'description': 'Practical strategies for building good habits and breaking bad ones.',
        'image': 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400',
        'published_date': '2018-10-16',
    },
    {
        'title': '1984',
        'author': 'George Orwell',
        'category': 'Fiction',
        'isbn': '978-0-452-28423-4',
        'quantity': 4,
        'description': 'A dystopian novel about totalitarianism, surveillance, and the suppression of truth.',
        'image': 'https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d?w=400',
        'published_date': '1949-06-08',
    },
]


class Command(BaseCommand):
    help = 'Seed the database with demo users and books'

    @transaction.atomic
    def handle(self, *args, **kwargs):
        from accounts.models import User
        from books.models import Book

        # Create demo users
        if not User.objects.filter(email='sarah@library.edu').exists():
            User.objects.create_user(
                email='sarah@library.edu',
                name='Sarah Wilson',
                password='password',
                role='librarian',
                phone='+1 555-0100',
                profile_image='https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
                is_staff=True,
            )
            self.stdout.write(self.style.SUCCESS('Created librarian: sarah@library.edu'))

        if not User.objects.filter(email='john@student.edu').exists():
            User.objects.create_user(
                email='john@student.edu',
                name='John Smith',
                password='password',
                role='student',
                phone='+1 555-0101',
                profile_image='https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400',
            )
            self.stdout.write(self.style.SUCCESS('Created student: john@student.edu'))

        if not User.objects.filter(email='emily@student.edu').exists():
            User.objects.create_user(
                email='emily@student.edu',
                name='Emily Davis',
                password='password',
                role='student',
                phone='+1 555-0102',
                profile_image='https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
            )

        # Create books
        created_count = 0
        for book_data in BOOKS_DATA:
            book, created = Book.objects.get_or_create(
                isbn=book_data['isbn'],
                defaults={
                    **book_data,
                    'available_quantity': book_data['quantity'],
                    'thumbnail': book_data['image'],
                },
            )
            if created:
                created_count += 1

        self.stdout.write(self.style.SUCCESS(
            f'Seed complete — {created_count} new books, {User.objects.count()} users.'
        ))
