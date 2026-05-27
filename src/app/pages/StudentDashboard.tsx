import { useState, useEffect } from 'react';
import { useAuth } from '../lib/AuthContext';
import { mockBooks, mockRequests, mockFines, Book, BookRequest } from '../lib/mockData';
import { booksApi, requestsApi, finesApi, ApiBook, ApiRequest, ApiFine } from '../lib/api';
import Layout from '../components/Layout';
import BookCard from '../components/BookCard';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../components/ui/dialog';
import { BookOpen, FileText, DollarSign, Clock } from 'lucide-react';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';

export default function StudentDashboard() {
  const { user, isApiConnected, hasCheckedApi } = useAuth();
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [books, setBooks] = useState<Book[]>([]);
  const [requests, setRequests] = useState<BookRequest[]>([]);
  const [fines, setFines] = useState<ApiFine[]>([]);

  useEffect(() => {
    if (!hasCheckedApi || !user) return;

    if (isApiConnected) {
      booksApi.list()
        .then((apiBooks) => {
          setBooks(
            apiBooks.map((b) => ({
              id: b.id,
              title: b.title,
              author: b.author,
              category: b.category,
              isbn: b.isbn,
              quantity: b.quantity,
              availableQuantity: b.available_quantity,
              description: b.description,
              image: b.image,
              thumbnail: b.thumbnail,
              publishedDate: b.published_date,
            }))
          );
        })
        .catch(() => {
          setBooks(mockBooks.slice(0, 4));
        });

      requestsApi.list()
        .then((apiRequests) => {
          setRequests(
            apiRequests.map((r) => ({
              id: r.id,
              studentId: r.student_id,
              bookId: r.book_id,
              requestType: r.request_type,
              status: r.status,
              requestDate: r.request_date,
              approvedDate: r.approved_date,
              returnDate: r.return_date,
              dueDate: r.due_date,
            }))
          );
        })
        .catch(() => {
          setRequests(mockRequests.filter((r) => r.studentId === user?.id));
        });

      finesApi.list()
        .then((apiFines) => {
          setFines(
            apiFines.map((fine) => ({
              id: fine.id,
              studentId: fine.student_id,
              amount: fine.amount,
              status: fine.status,
              paymentDate: fine.payment_date,
              reason: fine.reason,
            }))
          );
        })
        .catch(() => {
          setFines(mockFines.filter((f) => f.studentId === user?.id));
        });
    } else {
      setBooks(mockBooks.slice(0, 4));
      setRequests(mockRequests.filter((r) => r.studentId === user?.id));
      setFines(mockFines.filter((f) => f.studentId === user?.id));
    }
  }, [hasCheckedApi, isApiConnected, user]);

  const userRequests = requests.filter((r) => r.studentId === user?.id);
  const issuedBooks = userRequests.filter((r) => r.status === 'approved').length;
  const pendingRequests = userRequests.filter((r) => r.status === 'pending').length;
  const returnedBooks = userRequests.filter((r) => r.status === 'returned').length;
  const totalFines = fines.filter((f) => f.status === 'pending').reduce((sum, f) => sum + f.amount, 0);

  const recentBooks = books.slice(0, 4);

  const handleRequestBook = async (book: Book) => {
    if (!hasCheckedApi || isApiConnected) {
      try {
        const apiReq = await requestsApi.create(book.id);
        const newReq: BookRequest = {
          id: apiReq.id,
          studentId: apiReq.student_id,
          bookId: apiReq.book_id,
          requestType: apiReq.request_type,
          status: apiReq.status,
          requestDate: apiReq.request_date,
          approvedDate: apiReq.approved_date,
          returnDate: apiReq.return_date,
          dueDate: apiReq.due_date,
        };
        setRequests((prev) => [...prev, newReq]);
        toast.success(`Request submitted for "${book.title}"`);
        setSelectedBook(null);
        return;
      } catch (e: any) {
        toast.error(e.message || 'Failed to submit request');
        return;
      }
    }

    const newReq: BookRequest = {
      id: `req_${Date.now()}`,
      studentId: user!.id,
      bookId: book.id,
      requestType: 'issue',
      status: 'pending',
      requestDate: new Date().toISOString().split('T')[0],
    };
    setRequests((prev) => [...prev, newReq]);
    toast.success(`Request submitted for "${book.title}"`);
    setSelectedBook(null);
  };

  const stats = [
    {
      icon: BookOpen,
      label: 'Issued Books',
      value: issuedBooks,
      color: 'text-blue-600 bg-blue-100',
    },
    {
      icon: FileText,
      label: 'Pending Requests',
      value: pendingRequests,
      color: 'text-yellow-600 bg-yellow-100',
    },
    {
      icon: Clock,
      label: 'Returned Books',
      value: returnedBooks,
      color: 'text-green-600 bg-green-100',
    },
    {
      icon: DollarSign,
      label: 'Total Fines',
      value: `$${totalFines.toFixed(2)}`,
      color: 'text-red-600 bg-red-100',
    },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Welcome back, {user?.name}!</h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">Here's your library activity overview</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {stats.map((stat) => (
            <Card key={stat.label} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                  <div className={`p-2 sm:p-3 rounded-full ${stat.color} shrink-0`}>
                    <stat.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm text-muted-foreground truncate">{stat.label}</p>
                    <p className="text-xl sm:text-2xl font-bold">{stat.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Recent Additions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {recentBooks.map((book) => (
                <BookCard
                  key={book.id}
                  book={book}
                  onView={setSelectedBook}
                  onRequest={handleRequestBook}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        {selectedBook && (
          <Dialog open={!!selectedBook} onOpenChange={() => setSelectedBook(null)}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl">{selectedBook.title}</DialogTitle>
                <DialogDescription>by {selectedBook.author}</DialogDescription>
              </DialogHeader>
              <div className="grid md:grid-cols-2 gap-6 mt-4">
                <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-muted">
                  <img
                    src={selectedBook.image}
                    alt={selectedBook.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Description</h3>
                    <p className="text-muted-foreground">{selectedBook.description}</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Category:</span>
                      <span className="font-medium">{selectedBook.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">ISBN:</span>
                      <span className="font-medium">{selectedBook.isbn}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Published:</span>
                      <span className="font-medium">
                        {new Date(selectedBook.publishedDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Available:</span>
                      <span className="font-medium">
                        {selectedBook.availableQuantity} of {selectedBook.quantity}
                      </span>
                    </div>
                  </div>
                  <Button
                    className="w-full bg-primary hover:bg-primary/90"
                    disabled={selectedBook.availableQuantity === 0}
                    onClick={() => handleRequestBook(selectedBook)}
                  >
                    {selectedBook.availableQuantity > 0 ? 'Request This Book' : 'Not Available'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </Layout>
  );
}
