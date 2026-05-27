import { useState, useEffect } from 'react';
import { useAuth } from '../lib/AuthContext';
import { mockBooks, mockRequests, mockUsers, mockFines } from '../lib/mockData';
import { reportsApi, requestsApi } from '../lib/api';

import Layout from '../components/Layout';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../components/ui/card';

import {
  BookOpen,
  Users,
  FileText,
  DollarSign,
  Clock,
  TrendingUp,
} from 'lucide-react';

import { Badge } from '../components/ui/badge';

export default function LibrarianDashboard() {
  const { user, isApiConnected, hasCheckedApi } = useAuth();

  // ─────────────────────────────────────────────────────────────
  // Default mock stats
  // ─────────────────────────────────────────────────────────────

  const mockPendingFines = mockFines
    .filter((f) => f.status === 'pending')
    .reduce((sum, f) => sum + f.amount, 0);

  const [stats, setStats] = useState({
    total_books: mockBooks.reduce((s, b) => s + b.quantity, 0),
    total_users: mockUsers.filter((u) => u.role === 'student').length,
    pending_requests: mockRequests.filter((r) => r.status === 'pending').length,
    active_loans: mockRequests.filter((r) => r.status === 'approved').length,
    overdue_loans: mockRequests.filter(
      (r) =>
        r.status === 'approved' &&
        r.dueDate &&
        new Date(r.dueDate) < new Date()
    ).length,
    total_fines_pending: mockPendingFines,
  });

  const [recentRequests, setRecentRequests] = useState<any[]>(
    mockRequests.slice(0, 5)
  );

  // ─────────────────────────────────────────────────────────────
  // Load API Data
  // ─────────────────────────────────────────────────────────────

  useEffect(() => {
    if (!hasCheckedApi || !isApiConnected) return;

    // Load stats
    reportsApi
      .stats()
      .then((data) => {
        setStats(data);
      })
      .catch((err) => {
        console.error('Stats API Error:', err);
      });

    // Load requests
    requestsApi
      .list()
      .then((list) => {
        const mapped = list.slice(0, 5).map((r) => ({
          id: r.id,
          studentId: r.student_id,
          studentName: r.student_name,
          bookId: r.book_id,
          bookTitle: r.book_title,
          requestType: r.request_type,
          status: r.status,
          requestDate: r.request_date,
          approvedDate: r.approved_date,
          returnDate: r.return_date,
          dueDate: r.due_date,
        }));

        setRecentRequests(mapped);
      })
      .catch((err) => {
        console.error('Requests API Error:', err);
      });
  }, [hasCheckedApi, isApiConnected]);

  // ─────────────────────────────────────────────────────────────
  // Stats Cards
  // ─────────────────────────────────────────────────────────────

  const statCards = [
    {
      icon: BookOpen,
      label: 'Total Books',
      value: stats.total_books,
      color: 'text-blue-600 bg-blue-100',
    },
    {
      icon: Users,
      label: 'Active Students',
      value: stats.total_users,
      color: 'text-green-600 bg-green-100',
    },
    {
      icon: FileText,
      label: 'Issued Books',
      value: stats.active_loans,
      color: 'text-purple-600 bg-purple-100',
    },
    {
      icon: Clock,
      label: 'Pending Requests',
      value: stats.pending_requests,
      color: 'text-yellow-600 bg-yellow-100',
    },
    {
      icon: TrendingUp,
      label: 'Overdue Books',
      value: stats.overdue_loans,
      color: 'text-red-600 bg-red-100',
    },
    {
      icon: DollarSign,
      label: 'Fines Pending',
      value: `$${stats.total_fines_pending.toFixed(2)}`,
      color: 'text-emerald-600 bg-emerald-100',
    },
  ];

  const categoryBreakdown = [
    'Fiction',
    'Science',
    'Technology',
    'History',
    'Self-Help',
  ];

  // ─────────────────────────────────────────────────────────────
  // UI
  // ─────────────────────────────────────────────────────────────

  return (
    <Layout>
      <div className="space-y-6">

        {/* Header */}

        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            Librarian Dashboard
          </h1>

          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Welcome back, {user?.name}
          </p>
        </div>

        {/* Stats */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {statCards.map((stat) => (
            <Card
              key={stat.label}
              className="hover:shadow-md transition-shadow"
            >
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center gap-3 sm:gap-4">

                  <div
                    className={`p-2 sm:p-3 rounded-full ${stat.color} shrink-0`}
                  >
                    <stat.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      {stat.label}
                    </p>

                    <p className="text-xl sm:text-2xl font-bold">
                      {stat.value}
                    </p>
                  </div>

                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Grid */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">

          {/* Recent Requests */}

          <Card>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">
                Recent Requests
              </CardTitle>
            </CardHeader>

            <CardContent>
              <div className="space-y-3">

                {recentRequests.map((request) => {
                  const fallbackBook = mockBooks.find(
                    (b) => b.id === request.bookId
                  );

                  const title =
                    request.bookTitle ??
                    fallbackBook?.title ??
                    'Unknown Book';

                  const studentName =
                    request.studentName ??
                    mockUsers.find(
                      (u) => u.id === request.studentId
                    )?.name ??
                    'Unknown Student';

                  return (
                    <div
                      key={request.id}
                      className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg gap-2"
                    >

                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">
                          {title}
                        </p>

                        <p className="text-xs text-muted-foreground truncate">
                          {studentName}
                        </p>
                      </div>

                      <Badge
                        variant={
                          request.status === 'approved'
                            ? 'default'
                            : request.status === 'pending'
                            ? 'secondary'
                            : request.status === 'returned'
                            ? 'outline'
                            : 'destructive'
                        }
                        className="capitalize shrink-0"
                      >
                        {request.status}
                      </Badge>

                    </div>
                  );
                })}

              </div>
            </CardContent>
          </Card>

          {/* Categories */}

          <Card>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">
                Book Categories
              </CardTitle>
            </CardHeader>

            <CardContent>
              <div className="space-y-3">

                {categoryBreakdown.map((category) => {
                  const count = mockBooks.filter(
                    (b) => b.category === category
                  ).length;

                  const pct = mockBooks.length
                    ? (count / mockBooks.length) * 100
                    : 0;

                  return (
                    <div
                      key={category}
                      className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg gap-3"
                    >

                      <span className="font-medium text-sm truncate flex-1">
                        {category}
                      </span>

                      <div className="flex items-center gap-2 sm:gap-3 shrink-0">

                        <div className="w-16 sm:w-24 h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full"
                            style={{ width: `${pct}%` }}
                          />
                        </div>

                        <span className="text-sm font-medium w-6 sm:w-8 text-right">
                          {count}
                        </span>

                      </div>

                    </div>
                  );
                })}

              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </Layout>
  );
}