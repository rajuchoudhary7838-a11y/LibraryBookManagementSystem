export interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  isbn: string;
  quantity: number;
  availableQuantity: number;
  description: string;
  image: string;
  thumbnail: string;
  publishedDate: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'librarian';
  phone: string;
  profileImage: string;
}

export interface BookRequest {
  id: string;
  studentId: string;
  studentName?: string;
  bookId: string;
  bookTitle?: string;
  bookThumbnail?: string;
  requestType: 'issue' | 'return';
  status: 'pending' | 'approved' | 'declined' | 'returned';
  requestDate: string;
  approvedDate?: string;
  returnDate?: string;
  dueDate?: string;
}

export interface Fine {
  id: string;
  studentId: string;
  amount: number;
  status: 'pending' | 'paid';
  paymentDate?: string;
  reason: string;
}

export const mockBooks: Book[] = [
  {
    id: '1',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    category: 'Classic Literature',
    isbn: '978-0-7432-7356-5',
    quantity: 5,
    availableQuantity: 3,
    description: 'A classic American novel set in the Jazz Age, exploring themes of wealth, love, and the American Dream.',
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800',
    thumbnail: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400',
    publishedDate: '1925-04-10',
  },
  {
    id: '2',
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    category: 'Classic Literature',
    isbn: '978-0-06-112008-4',
    quantity: 4,
    availableQuantity: 2,
    description: 'A gripping tale of racial injustice and childhood innocence in the American South.',
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800',
    thumbnail: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400',
    publishedDate: '1960-07-11',
  },
  {
    id: '3',
    title: '1984',
    author: 'George Orwell',
    category: 'Science Fiction',
    isbn: '978-0-452-28423-4',
    quantity: 6,
    availableQuantity: 4,
    description: 'A dystopian social science fiction novel exploring surveillance, totalitarianism, and truth.',
    image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800',
    thumbnail: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400',
    publishedDate: '1949-06-08',
  },
  {
    id: '4',
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    category: 'Romance',
    isbn: '978-0-14-143951-8',
    quantity: 5,
    availableQuantity: 5,
    description: 'A romantic novel of manners exploring themes of marriage, morality, and misconceptions.',
    image: 'https://images.unsplash.com/photo-1524578271613-d550eacf6090?w=800',
    thumbnail: 'https://images.unsplash.com/photo-1524578271613-d550eacf6090?w=400',
    publishedDate: '1813-01-28',
  },
  {
    id: '5',
    title: 'The Catcher in the Rye',
    author: 'J.D. Salinger',
    category: 'Coming of Age',
    isbn: '978-0-316-76948-0',
    quantity: 4,
    availableQuantity: 1,
    description: 'A story about teenage rebellion and alienation in post-war America.',
    image: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800',
    thumbnail: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=400',
    publishedDate: '1951-07-16',
  },
  {
    id: '6',
    title: 'Harry Potter and the Philosopher\'s Stone',
    author: 'J.K. Rowling',
    category: 'Fantasy',
    isbn: '978-0-439-70818-8',
    quantity: 8,
    availableQuantity: 2,
    description: 'The magical journey begins as Harry Potter discovers he is a wizard.',
    image: 'https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?w=800',
    thumbnail: 'https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?w=400',
    publishedDate: '1997-06-26',
  },
  {
    id: '7',
    title: 'The Hobbit',
    author: 'J.R.R. Tolkien',
    category: 'Fantasy',
    isbn: '978-0-547-92822-7',
    quantity: 5,
    availableQuantity: 3,
    description: 'A fantasy adventure following Bilbo Baggins on an unexpected journey.',
    image: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=800',
    thumbnail: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=400',
    publishedDate: '1937-09-21',
  },
  {
    id: '8',
    title: 'The Da Vinci Code',
    author: 'Dan Brown',
    category: 'Mystery',
    isbn: '978-0-385-50420-1',
    quantity: 6,
    availableQuantity: 4,
    description: 'A mystery thriller involving art, conspiracy theories, and ancient secrets.',
    image: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=800',
    thumbnail: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400',
    publishedDate: '2003-03-18',
  },
  {
    id: '9',
    title: 'Sapiens',
    author: 'Yuval Noah Harari',
    category: 'Non-Fiction',
    isbn: '978-0-062-31609-7',
    quantity: 7,
    availableQuantity: 5,
    description: 'A brief history of humankind exploring human evolution and societal development.',
    image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=800',
    thumbnail: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400',
    publishedDate: '2011-01-01',
  },
  {
    id: '10',
    title: 'Educated',
    author: 'Tara Westover',
    category: 'Biography',
    isbn: '978-0-399-59050-4',
    quantity: 5,
    availableQuantity: 3,
    description: 'A memoir about a woman who grows up in a survivalist family and eventually earns a PhD.',
    image: 'https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=800',
    thumbnail: 'https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=400',
    publishedDate: '2018-02-20',
  },
  {
    id: '11',
    title: 'The Alchemist',
    author: 'Paulo Coelho',
    category: 'Philosophy',
    isbn: '978-0-06-112241-5',
    quantity: 6,
    availableQuantity: 4,
    description: 'A philosophical novel about a young shepherd\'s journey to find treasure and his personal legend.',
    image: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=800',
    thumbnail: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400',
    publishedDate: '1988-01-01',
  },
  {
    id: '12',
    title: 'The Lean Startup',
    author: 'Eric Ries',
    category: 'Business',
    isbn: '978-0-307-88789-4',
    quantity: 5,
    availableQuantity: 3,
    description: 'A guide to building successful startups through continuous innovation and validated learning.',
    image: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=800',
    thumbnail: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=400',
    publishedDate: '2011-09-13',
  },
];

export const mockUsers: User[] = [
  {
    id: 'student1',
    name: 'John Doe',
    email: 'john@student.edu',
    role: 'student',
    phone: '+1 234-567-8901',
    profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
  },
  {
    id: 'student2',
    name: 'Jane Smith',
    email: 'jane@student.edu',
    role: 'student',
    phone: '+1 234-567-8903',
    profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
  },
  {
    id: 'student3',
    name: 'Mike Johnson',
    email: 'mike@student.edu',
    role: 'student',
    phone: '+1 234-567-8904',
    profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
  },
  {
    id: 'student4',
    name: 'Sarah Wilson',
    email: 'sarah.w@student.edu',
    role: 'student',
    phone: '+1 234-567-8905',
    profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
  },
  {
    id: 'student5',
    name: 'Tom Brown',
    email: 'tom@student.edu',
    role: 'student',
    phone: '+1 234-567-8906',
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
  },
  {
    id: 'student6',
    name: 'Emily Davis',
    email: 'emily@student.edu',
    role: 'student',
    phone: '+1 234-567-8907',
    profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
  },
  {
    id: 'librarian1',
    name: 'Sarah Admin',
    email: 'sarah@library.edu',
    role: 'librarian',
    phone: '+1 234-567-8902',
    profileImage: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400',
  },
];

export const mockRequests: BookRequest[] = [
  {
    id: 'req1',
    studentId: 'student1',
    bookId: '1',
    requestType: 'issue',
    status: 'approved',
    requestDate: '2026-05-20',
    approvedDate: '2026-05-21',
    dueDate: '2026-06-20',
  },
  {
    id: 'req2',
    studentId: 'student1',
    bookId: '3',
    requestType: 'issue',
    status: 'pending',
    requestDate: '2026-05-25',
  },
  {
    id: 'req3',
    studentId: 'student1',
    bookId: '2',
    requestType: 'issue',
    status: 'returned',
    requestDate: '2026-05-10',
    approvedDate: '2026-05-11',
    returnDate: '2026-05-24',
  },
  {
    id: 'req4',
    studentId: 'student2',
    bookId: '4',
    requestType: 'issue',
    status: 'pending',
    requestDate: '2026-05-26',
  },
  {
    id: 'req5',
    studentId: 'student2',
    bookId: '6',
    requestType: 'issue',
    status: 'approved',
    requestDate: '2026-05-15',
    approvedDate: '2026-05-16',
    dueDate: '2026-06-15',
  },
  {
    id: 'req6',
    studentId: 'student3',
    bookId: '7',
    requestType: 'issue',
    status: 'approved',
    requestDate: '2026-05-18',
    approvedDate: '2026-05-19',
    dueDate: '2026-06-18',
  },
  {
    id: 'req7',
    studentId: 'student3',
    bookId: '5',
    requestType: 'issue',
    status: 'declined',
    requestDate: '2026-05-24',
  },
  {
    id: 'req8',
    studentId: 'student4',
    bookId: '8',
    requestType: 'issue',
    status: 'pending',
    requestDate: '2026-05-26',
  },
  {
    id: 'req9',
    studentId: 'student4',
    bookId: '9',
    requestType: 'issue',
    status: 'returned',
    requestDate: '2026-05-05',
    approvedDate: '2026-05-06',
    returnDate: '2026-05-20',
  },
  {
    id: 'req10',
    studentId: 'student5',
    bookId: '10',
    requestType: 'issue',
    status: 'approved',
    requestDate: '2026-05-22',
    approvedDate: '2026-05-23',
    dueDate: '2026-06-22',
  },
  {
    id: 'req11',
    studentId: 'student5',
    bookId: '11',
    requestType: 'issue',
    status: 'pending',
    requestDate: '2026-05-26',
  },
  {
    id: 'req12',
    studentId: 'student6',
    bookId: '12',
    requestType: 'issue',
    status: 'approved',
    requestDate: '2026-05-10',
    approvedDate: '2026-05-11',
    dueDate: '2026-05-25',
  },
];

export const mockFines: Fine[] = [
  {
    id: 'fine1',
    studentId: 'student1',
    amount: 5.00,
    status: 'pending',
    reason: 'Late return of "To Kill a Mockingbird"',
  },
  {
    id: 'fine2',
    studentId: 'student2',
    amount: 3.50,
    status: 'pending',
    reason: 'Late return of "Harry Potter and the Philosopher\'s Stone"',
  },
  {
    id: 'fine3',
    studentId: 'student4',
    amount: 7.00,
    status: 'pending',
    reason: 'Late return of "The Da Vinci Code"',
  },
  {
    id: 'fine4',
    studentId: 'student5',
    amount: 2.50,
    status: 'paid',
    reason: 'Late return of "Educated"',
    paymentDate: '2026-05-20',
  },
  {
    id: 'fine5',
    studentId: 'student6',
    amount: 10.00,
    status: 'pending',
    reason: 'Late return of "The Lean Startup"',
  },
];

export const categories = [
  'Classic Literature',
  'Science Fiction',
  'Romance',
  'Coming of Age',
  'Fantasy',
  'Mystery',
  'Non-Fiction',
  'Biography',
  'Philosophy',
  'Business',
  'History',
  'Self-Help',
];
