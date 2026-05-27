import { useState, useEffect } from 'react';
import { useAuth } from '../lib/AuthContext';
import { mockBooks, mockRequests, Book, BookRequest, categories } from '../lib/mockData';
import { booksApi, requestsApi } from '../lib/api';
import Layout from '../components/Layout';
import BookCard, { BookRequestStatus } from '../components/BookCard';
import ImageUpload from '../components/ImageUpload';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { Search, Plus, Filter, Edit, Trash2, BookOpen, Calendar, Hash, Package, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../components/ui/alert-dialog';

export default function BooksPage() {
  const { user, isApiConnected, hasCheckedApi } = useAuth();
  const isLibrarian = user?.role === 'librarian';

  const [books, setBooks] = useState<Book[]>([]);
  const [userRequests, setUserRequests] = useState<BookRequest[]>([]);

  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isStockDialogOpen, setIsStockDialogOpen] = useState(false);
  const [stockBook, setStockBook] = useState<Book | null>(null);
  const [newStockQuantity, setNewStockQuantity] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [editBook, setEditBook] = useState<Book | null>(null);

  const [newBook, setNewBook] = useState({
    title: '', author: '', category: '', isbn: '',
    quantity: 1, description: '', image: '', publishedDate: '',
  });

  // Load books from API if connected
  useEffect(() => {
    if (!hasCheckedApi || !isApiConnected) return;
    booksApi.list()
      .then((apiBooks) => {
        const mapped: Book[] = apiBooks.map((b) => ({
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
        }));
        setBooks(mapped);
      })
      .catch(() => { /* silently fall back to mock */ });
  }, [hasCheckedApi, isApiConnected]);

  // If API is not available, fall back to mock data
  useEffect(() => {
    if (!hasCheckedApi || isApiConnected) return;
    setBooks(mockBooks);
    setUserRequests(mockRequests.filter((r) => r.studentId === user?.id));
  }, [hasCheckedApi, isApiConnected, user]);

  // Load user's requests from API if connected
  useEffect(() => {
    if (!hasCheckedApi || !isApiConnected || !user || isLibrarian) return;
    requestsApi.list()
      .then((apiRequests) => {
        const mapped: BookRequest[] = apiRequests.map((r) => ({
          id: r.id,
          studentId: r.student_id,
          bookId: r.book_id,
          requestType: r.request_type,
          status: r.status,
          requestDate: r.request_date,
          approvedDate: r.approved_date,
          returnDate: r.return_date,
          dueDate: r.due_date,
        }));
        setUserRequests(mapped.filter((r) => r.studentId === user.id));
      })
      .catch(() => { /* silently fall back to mock */ });
  }, [isApiConnected, user, isLibrarian]);

  // Derive per-book request status for the current student
  const getBookRequestStatus = (bookId: string): BookRequestStatus => {
    const req = userRequests
      .filter((r) => r.bookId === bookId)
      .sort((a, b) => new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime())[0];

    if (!req) return 'none';
    return req.status as BookRequestStatus;
  };

  // ── Request a book ────────────────────────────────────────────────────────
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
        };
        setUserRequests((prev) => [...prev, newReq]);
        toast.success(`Request submitted for "${book.title}"`);
        setSelectedBook(null);
        return;
      } catch (e: any) {
        toast.error(e.message || 'Failed to submit request');
        return;
      }
    }

    // Mock fallback
    const newReq: BookRequest = {
      id: `req_${Date.now()}`,
      studentId: user!.id,
      bookId: book.id,
      requestType: 'issue',
      status: 'pending',
      requestDate: new Date().toISOString().split('T')[0],
    };
    setUserRequests((prev) => [...prev, newReq]);
    toast.success(`Request submitted for "${book.title}"`);
    setSelectedBook(null);
  };

  // ── Return a book ─────────────────────────────────────────────────────────
  const handleReturnBook = async (book: Book) => {
    const req = userRequests
      .filter((r) => r.bookId === book.id && r.status === 'approved')
      .sort((a, b) => new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime())[0];

    if (!req) return;

    if (!hasCheckedApi || isApiConnected) {
      try {
        await requestsApi.markReturned(req.id);
        setUserRequests((prev) =>
          prev.map((r) =>
            r.id === req.id
              ? { ...r, status: 'returned', returnDate: new Date().toISOString().split('T')[0] }
              : r
          )
        );
        toast.success(`"${book.title}" marked as returned!`);
        setSelectedBook(null);
        return;
      } catch (e: any) {
        toast.error(e.message || 'Failed to process return');
        return;
      }
    }

    // Mock fallback
    setUserRequests((prev) =>
      prev.map((r) =>
        r.id === req.id
          ? { ...r, status: 'returned', returnDate: new Date().toISOString().split('T')[0] }
          : r
      )
    );
    toast.success(`"${book.title}" marked as returned!`);
    setSelectedBook(null);
  };

  // ── Librarian actions ─────────────────────────────────────────────────────
  const handleAddBook = async () => {
    if (!newBook.title || !newBook.author || !newBook.category || !newBook.image) {
      toast.error('Please fill in all required fields');
      return;
    }

    const bookData = {
      title: newBook.title, author: newBook.author, category: newBook.category,
      isbn: newBook.isbn, quantity: newBook.quantity, available_quantity: newBook.quantity,
      description: newBook.description, image: newBook.image, thumbnail: newBook.image,
      published_date: newBook.publishedDate,
    };

    if (isApiConnected) {
      try {
        const created = await booksApi.create(bookData);
        const book: Book = {
          id: created.id, title: created.title, author: created.author,
          category: created.category, isbn: created.isbn, quantity: created.quantity,
          availableQuantity: created.available_quantity, description: created.description,
          image: created.image, thumbnail: created.thumbnail, publishedDate: created.published_date,
        };
        setBooks((prev) => [book, ...prev]);
        toast.success(`"${book.title}" added successfully!`);
        setIsAddDialogOpen(false);
        resetNewBook();
        return;
      } catch (e: any) {
        toast.error(e.message || 'Failed to add book');
        return;
      }
    }

    const book: Book = {
      id: `book_${Date.now()}`, ...newBook, availableQuantity: newBook.quantity, thumbnail: newBook.image,
    };
    setBooks((prev) => [book, ...prev]);
    toast.success(`"${book.title}" added successfully!`);
    setIsAddDialogOpen(false);
    resetNewBook();
  };

  const resetNewBook = () =>
    setNewBook({ title: '', author: '', category: '', isbn: '', quantity: 1, description: '', image: '', publishedDate: '' });

  const handleEditBook = async () => {
    if (!editBook) return;

    if (isApiConnected) {
      try {
        const updated = await booksApi.update(editBook.id, {
          title: editBook.title, author: editBook.author, category: editBook.category,
          isbn: editBook.isbn, quantity: editBook.quantity, description: editBook.description,
          image: editBook.image, thumbnail: editBook.thumbnail,
        });
        const book: Book = {
          id: updated.id, title: updated.title, author: updated.author,
          category: updated.category, isbn: updated.isbn, quantity: updated.quantity,
          availableQuantity: updated.available_quantity, description: updated.description,
          image: updated.image, thumbnail: updated.thumbnail, publishedDate: updated.published_date,
        };
        setBooks((prev) => prev.map((b) => b.id === book.id ? book : b));
        toast.success(`"${book.title}" updated successfully!`);
        setIsEditDialogOpen(false);
        setSelectedBook(null);
        setEditBook(null);
        return;
      } catch (e: any) {
        toast.error(e.message || 'Failed to update book');
        return;
      }
    }

    setBooks((prev) => prev.map((b) => b.id === editBook.id ? editBook : b));
    toast.success(`"${editBook.title}" updated successfully!`);
    setIsEditDialogOpen(false);
    setSelectedBook(null);
    setEditBook(null);
  };

  const handleDeleteBook = async () => {
    if (!selectedBook) return;

    if (isApiConnected) {
      try {
        await booksApi.delete(selectedBook.id);
        setBooks((prev) => prev.filter((b) => b.id !== selectedBook.id));
        toast.success(`"${selectedBook.title}" deleted!`);
        setIsDeleteDialogOpen(false);
        setSelectedBook(null);
        return;
      } catch (e: any) {
        toast.error(e.message || 'Failed to delete book');
        return;
      }
    }

    setBooks((prev) => prev.filter((b) => b.id !== selectedBook.id));
    toast.success(`"${selectedBook.title}" deleted!`);
    setIsDeleteDialogOpen(false);
    setSelectedBook(null);
  };

  const handleUpdateStock = async () => {
    if (!stockBook) return;
    const qty = parseInt(newStockQuantity);
    if (isNaN(qty) || qty < 0) { toast.error('Please enter a valid quantity'); return; }

    if (isApiConnected) {
      try {
        await booksApi.update(stockBook.id, { quantity: qty, available_quantity: qty });
      } catch (e: any) {
        toast.error(e.message || 'Failed to update stock');
        return;
      }
    }

    setBooks((prev) => prev.map((b) => b.id === stockBook.id ? { ...b, quantity: qty, availableQuantity: qty } : b));
    toast.success('Stock quantity updated!');
    setIsStockDialogOpen(false);
    setStockBook(null);
    setNewStockQuantity('');
  };

  const filteredBooks = books.filter((book) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = book.title.toLowerCase().includes(q) ||
      book.author.toLowerCase().includes(q) || book.category.toLowerCase().includes(q);
    const matchesCategory = categoryFilter === 'all' || book.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              {isLibrarian ? 'Manage Books' : 'Browse Books'}
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">
              {isLibrarian
                ? 'Add, update, and manage book collection'
                : 'Search and request books from our collection'}
            </p>
          </div>
          {isLibrarian && (
            <Button onClick={() => setIsAddDialogOpen(true)} className="bg-primary hover:bg-primary/90 w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-2" /> Add New Book
            </Button>
          )}
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by title, author, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full md:w-64 h-11">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((cat) => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredBooks.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              onView={setSelectedBook}
              onRequest={!isLibrarian ? handleRequestBook : undefined}
              onReturn={!isLibrarian ? handleReturnBook : undefined}
              userRequestStatus={!isLibrarian ? getBookRequestStatus(book.id) : 'none'}
              showActions={true}
            />
          ))}
        </div>

        {filteredBooks.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No books found matching your criteria.</p>
          </div>
        )}

        {/* View Book Details Dialog */}
        {selectedBook && (
          <Dialog open={!!selectedBook} onOpenChange={() => setSelectedBook(null)}>
            <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto p-0">
              <div className="grid md:grid-cols-[350px,1fr]">
                {/* Left – Book Cover */}
                <div className="bg-gradient-to-br from-primary/5 to-accent/5 p-8 flex flex-col items-center justify-start border-r">
                  <div className="relative w-full max-w-[280px] aspect-[3/4] rounded-lg overflow-hidden shadow-2xl mb-6">
                    <img src={selectedBook.image} alt={selectedBook.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
                    <Badge variant={selectedBook.availableQuantity > 0 ? 'default' : 'destructive'} className="text-xs px-3 py-1">
                      {selectedBook.availableQuantity > 0 ? `${selectedBook.availableQuantity} Available` : 'Out of Stock'}
                    </Badge>
                    <Badge variant="secondary" className="text-xs px-3 py-1">{selectedBook.category}</Badge>
                  </div>
                  {/* Show request status badge for students */}
                  {!isLibrarian && (() => {
                    const status = getBookRequestStatus(selectedBook.id);
                    if (status === 'pending') return <Badge className="bg-yellow-500 text-white">Request Pending</Badge>;
                    if (status === 'approved') return <Badge className="bg-green-600 text-white">Issued to You</Badge>;
                    if (status === 'returned') return <Badge variant="outline">Previously Borrowed</Badge>;
                    return null;
                  })()}
                </div>

                {/* Right – Details */}
                <div className="p-6 sm:p-8 space-y-6">
                  <div>
                    <DialogTitle className="text-3xl font-bold mb-2">{selectedBook.title}</DialogTitle>
                    <DialogDescription className="text-lg text-muted-foreground">by {selectedBook.author}</DialogDescription>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-2">
                      <BookOpen className="w-4 h-4" /> About This Book
                    </h3>
                    <p className="text-foreground leading-relaxed">{selectedBook.description}</p>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">Details</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        { icon: Hash, label: 'ISBN', value: selectedBook.isbn },
                        { icon: Calendar, label: 'Published', value: new Date(selectedBook.publishedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) },
                        { icon: Package, label: 'Total Stock', value: `${selectedBook.quantity} copies` },
                        { icon: BookOpen, label: 'Available Now', value: `${selectedBook.availableQuantity} copies` },
                      ].map(({ icon: Icon, label, value }) => (
                        <div key={label} className="flex items-start gap-3 p-4 rounded-lg bg-secondary/20 border border-secondary">
                          <Icon className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">{label}</p>
                            <p className="font-medium">{value}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Student actions */}
                  {!isLibrarian && (() => {
                    const status = getBookRequestStatus(selectedBook.id);
                    if (status === 'pending') {
                      return (
                        <Button className="w-full h-12 bg-yellow-500 hover:bg-yellow-500 cursor-not-allowed opacity-80 text-base" disabled>
                          Request Pending…
                        </Button>
                      );
                    }
                    if (status === 'approved') {
                      return (
                        <Button
                          className="w-full h-12 bg-green-600 hover:bg-green-700 text-white text-base font-semibold"
                          onClick={() => handleReturnBook(selectedBook)}
                        >
                          <RotateCcw className="w-5 h-5 mr-2" /> Return This Book
                        </Button>
                      );
                    }
                    return (
                      <Button
                        className="w-full h-12 bg-primary hover:bg-primary/90 text-base font-semibold"
                        disabled={selectedBook.availableQuantity === 0}
                        onClick={() => handleRequestBook(selectedBook)}
                      >
                        {selectedBook.availableQuantity > 0 ? 'Request This Book' : 'Currently Unavailable'}
                      </Button>
                    );
                  })()}

                  {/* Librarian actions */}
                  {isLibrarian && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                      <Button variant="outline" className="w-full h-11" onClick={() => { setSelectedBook(null); setEditBook({ ...selectedBook }); setIsEditDialogOpen(true); }}>
                        <Edit className="w-4 h-4 mr-2" /> Edit Book
                      </Button>
                      <Button variant="outline" className="w-full h-11" onClick={() => { setStockBook(selectedBook); setNewStockQuantity(selectedBook.quantity.toString()); setSelectedBook(null); setIsStockDialogOpen(true); }}>
                        <Package className="w-4 h-4 mr-2" /> Update Stock
                      </Button>
                      <Button variant="destructive" className="w-full h-11" onClick={() => setIsDeleteDialogOpen(true)}>
                        <Trash2 className="w-4 h-4 mr-2" /> Delete Book
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}

        {/* Add New Book Dialog */}
        {isLibrarian && (
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Book</DialogTitle>
                <DialogDescription>Fill in the book details and upload a cover image</DialogDescription>
              </DialogHeader>
              <div className="space-y-6 mt-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    {[
                      { id: 'title', label: 'Title *', placeholder: 'Enter book title', key: 'title' as const },
                      { id: 'author', label: 'Author *', placeholder: 'Enter author name', key: 'author' as const },
                      { id: 'isbn', label: 'ISBN', placeholder: '978-0-123456-78-9', key: 'isbn' as const },
                    ].map(({ id, label, placeholder, key }) => (
                      <div key={id} className="space-y-2">
                        <Label htmlFor={id}>{label}</Label>
                        <Input id={id} placeholder={placeholder} value={newBook[key]} onChange={(e) => setNewBook({ ...newBook, [key]: e.target.value })} />
                      </div>
                    ))}
                    <div className="space-y-2">
                      <Label htmlFor="category">Category *</Label>
                      <Select value={newBook.category} onValueChange={(v) => setNewBook({ ...newBook, category: v })}>
                        <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                        <SelectContent>{categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="quantity">Quantity</Label>
                        <Input id="quantity" type="number" min="1" value={newBook.quantity} onChange={(e) => setNewBook({ ...newBook, quantity: parseInt(e.target.value) || 1 })} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="publishedDate">Published</Label>
                        <Input id="publishedDate" type="date" value={newBook.publishedDate} onChange={(e) => setNewBook({ ...newBook, publishedDate: e.target.value })} />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Book Cover Image *</Label>
                      <ImageUpload onImageSelected={(url) => setNewBook({ ...newBook, image: url })} currentImage={newBook.image} onRemove={() => setNewBook({ ...newBook, image: '' })} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea id="description" placeholder="Enter book description..." rows={5} value={newBook.description} onChange={(e) => setNewBook({ ...newBook, description: e.target.value })} />
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                  <Button className="flex-1 bg-primary hover:bg-primary/90" onClick={handleAddBook}>Add Book</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}

        {/* Edit Book Dialog */}
        {isLibrarian && editBook && (
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Update Book</DialogTitle>
                <DialogDescription>Edit book details and save changes</DialogDescription>
              </DialogHeader>
              <div className="space-y-6 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    {[
                      { id: 'editTitle', label: 'Title *', key: 'title' as const },
                      { id: 'editAuthor', label: 'Author *', key: 'author' as const },
                      { id: 'editIsbn', label: 'ISBN', key: 'isbn' as const },
                    ].map(({ id, label, key }) => (
                      <div key={id} className="space-y-2">
                        <Label htmlFor={id}>{label}</Label>
                        <Input id={id} value={editBook[key]} onChange={(e) => setEditBook({ ...editBook, [key]: e.target.value })} />
                      </div>
                    ))}
                    <div className="space-y-2">
                      <Label>Category *</Label>
                      <Select value={editBook.category} onValueChange={(v) => setEditBook({ ...editBook, category: v })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>{categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="editQuantity">Quantity</Label>
                      <Input id="editQuantity" type="number" min="1" value={editBook.quantity} onChange={(e) => setEditBook({ ...editBook, quantity: parseInt(e.target.value) || 1 })} />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Book Cover Image *</Label>
                      <ImageUpload onImageSelected={(url) => setEditBook({ ...editBook, image: url, thumbnail: url })} currentImage={editBook.image} onRemove={() => setEditBook({ ...editBook, image: '', thumbnail: '' })} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="editDescription">Description</Label>
                      <Textarea id="editDescription" rows={4} value={editBook.description} onChange={(e) => setEditBook({ ...editBook, description: e.target.value })} />
                    </div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button variant="outline" className="flex-1" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
                  <Button className="flex-1 bg-primary hover:bg-primary/90" onClick={handleEditBook}>Save Changes</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}

        {/* Update Stock Dialog */}
        <Dialog open={isStockDialogOpen} onOpenChange={setIsStockDialogOpen}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>Update Stock Quantity</DialogTitle>
              <DialogDescription>Set the new total stock for "{stockBook?.title}"</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-2">
              <div className="space-y-2">
                <Label htmlFor="stockQty">Current Quantity: {stockBook?.quantity}</Label>
                <Input id="stockQty" type="number" min="0" value={newStockQuantity} onChange={(e) => setNewStockQuantity(e.target.value)} placeholder="Enter new quantity" className="h-11" />
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setIsStockDialogOpen(false)}>Cancel</Button>
                <Button className="flex-1 bg-primary hover:bg-primary/90" onClick={handleUpdateStock}>Update</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete "{selectedBook?.title}". This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteBook} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Layout>
  );
}
