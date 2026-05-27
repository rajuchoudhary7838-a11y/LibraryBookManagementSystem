import { useState, useEffect } from 'react';
import { useAuth } from '../lib/AuthContext';
import {
  mockRequests,
  mockBooks,
  mockUsers,
  BookRequest,
} from '../lib/mockData';

import { requestsApi } from '../lib/api';

import Layout from '../components/Layout';

import {
  Card,
  CardContent,
} from '../components/ui/card';

import {
  Badge,
} from '../components/ui/badge';

import {
  Button,
} from '../components/ui/button';

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../components/ui/tabs';

import {
  CheckCircle,
  XCircle,
  Clock,
  BookOpen,
  User,
  Calendar,
  RotateCcw,
} from 'lucide-react';

import { toast } from 'sonner';

export default function RequestsPage() {

  const {
    user,
    isApiConnected,
    hasCheckedApi,
  } = useAuth();

  const isLibrarian =
    user?.role === 'librarian';

  const [requests, setRequests] =
    useState<BookRequest[]>([]);

  // ─────────────────────────────────────────────
  // FETCH REQUESTS
  // ─────────────────────────────────────────────

  useEffect(() => {

    if (!hasCheckedApi) return;

    // USE MOCK DATA
    if (!isApiConnected) {

      setRequests(
        isLibrarian
          ? mockRequests
          : mockRequests.filter(
              (r) => r.studentId === user?.id
            )
      );

      return;
    }

    // USE API
    requestsApi
      .list()
      .then((apiRequests) => {

        console.log(
          'REQUESTS:',
          apiRequests
        );

        const mapped: BookRequest[] =
          apiRequests.map((r) => ({

            id: r.id,

            studentId: r.student_id,
            studentName: r.student_name,

            bookId: r.book_id,
            bookTitle: r.book_title,
            bookThumbnail: r.book_thumbnail,

            status: r.status,

            requestDate: r.request_date,
            approvedDate: r.approved_date,
            returnDate: r.return_date,
            dueDate: r.due_date,
          }));

        setRequests(
          isLibrarian
            ? mapped
            : mapped.filter(
                (r) => r.studentId === user?.id
              )
        );
      })
      .catch((err) => {

        console.log(err);

        setRequests(
          isLibrarian
            ? mockRequests
            : mockRequests.filter(
                (r) => r.studentId === user?.id
              )
        );
      });

  }, [
    hasCheckedApi,
    isApiConnected,
    isLibrarian,
    user?.id,
  ]);

  // ─────────────────────────────────────────────
  // APPROVE
  // ─────────────────────────────────────────────

  const handleApprove = async (
    requestId: string
  ) => {

    console.log(
      'APPROVE:',
      requestId
    );

    if (
      hasCheckedApi &&
      isApiConnected
    ) {

      try {

        await requestsApi.approve(
          requestId
        );

      } catch (e: any) {

        console.log(e);

        toast.error(
          e.message ||
          'Failed to approve request'
        );

        return;
      }
    }

    setRequests((prev) =>
      prev.map((req) =>
        req.id === requestId
          ? {
              ...req,

              status: 'approved',

              approvedDate:
                new Date()
                  .toISOString()
                  .split('T')[0],

              dueDate:
                new Date(
                  Date.now() +
                  14 * 24 * 60 * 60 * 1000
                )
                  .toISOString()
                  .split('T')[0],
            }
          : req
      )
    );

    toast.success(
      'Request approved'
    );
  };

  // ─────────────────────────────────────────────
  // DECLINE
  // ─────────────────────────────────────────────

  const handleDecline = async (
    requestId: string
  ) => {

    console.log(
      'DECLINE:',
      requestId
    );

    if (
      hasCheckedApi &&
      isApiConnected
    ) {

      try {

        await requestsApi.decline(
          requestId
        );

      } catch (e: any) {

        console.log(e);

        toast.error(
          e.message ||
          'Failed to decline request'
        );

        return;
      }
    }

    setRequests((prev) =>
      prev.map((req) =>
        req.id === requestId
          ? {
              ...req,
              status: 'declined',
            }
          : req
      )
    );

    toast.success(
      'Request declined'
    );
  };

  // ─────────────────────────────────────────────
  // RETURN
  // ─────────────────────────────────────────────

  const handleMarkReturned =
    async (
      requestId: string
    ) => {

      console.log(
        'RETURN:',
        requestId
      );

      if (
        hasCheckedApi &&
        isApiConnected
      ) {

        try {

          await requestsApi.markReturned(
            requestId
          );

        } catch (e: any) {

          console.log(e);

          toast.error(
            e.message ||
            'Failed to mark as returned'
          );

          return;
        }
      }

      setRequests((prev) =>
        prev.map((req) =>
          req.id === requestId
            ? {
                ...req,
                status: 'returned',

                returnDate:
                  new Date()
                    .toISOString()
                    .split('T')[0],
              }
            : req
        )
      );

      toast.success(
        'Book marked as returned!'
      );
    };

  // ─────────────────────────────────────────────
  // CANCEL
  // ─────────────────────────────────────────────

  const handleCancelRequest =
    async (
      requestId: string
    ) => {

      console.log(
        'CANCEL:',
        requestId
      );

      if (
        hasCheckedApi &&
        isApiConnected
      ) {

        try {

          await requestsApi.cancel(
            requestId
          );

        } catch (e: any) {

          console.log(e);

          toast.error(
            e.message ||
            'Failed to cancel request'
          );

          return;
        }
      }

      setRequests((prev) =>
        prev.filter(
          (req) =>
            req.id !== requestId
        )
      );

      toast.success(
        'Request cancelled'
      );
    };

  // ─────────────────────────────────────────────
  // FILTERS
  // ─────────────────────────────────────────────

  const pendingRequests =
    requests.filter(
      (r) =>
        r.status === 'pending'
    );

  const approvedRequests =
    requests.filter(
      (r) =>
        r.status === 'approved'
    );

  const completedRequests =
    requests.filter(
      (r) =>
        r.status === 'returned'
    );

  const declinedRequests =
    requests.filter(
      (r) =>
        r.status === 'declined'
    );

  // ─────────────────────────────────────────────
  // BADGES
  // ─────────────────────────────────────────────

  const getStatusBadge = (
    status: string
  ) => {

    const map: Record<
      string,
      {
        variant:
          | 'secondary'
          | 'default'
          | 'outline'
          | 'destructive';

        icon: typeof Clock;
      }
    > = {

      pending: {
        variant: 'secondary',
        icon: Clock,
      },

      approved: {
        variant: 'default',
        icon: CheckCircle,
      },

      returned: {
        variant: 'outline',
        icon: CheckCircle,
      },

      declined: {
        variant: 'destructive',
        icon: XCircle,
      },
    };

    const {
      variant,
      icon: Icon,
    } = map[status] ?? map.pending;

    return (
      <Badge
        variant={variant}
        className="gap-1"
      >
        <Icon className="w-3 h-3" />

        {status
          .charAt(0)
          .toUpperCase() +
          status.slice(1)}
      </Badge>
    );
  };

  // ─────────────────────────────────────────────
  // REQUEST CARD
  // ─────────────────────────────────────────────

  const RequestCard = ({
    request,
  }: {
    request: BookRequest;
  }) => {

    const book =
      mockBooks.find(
        (b) =>
          b.id === request.bookId
      );

    const student =
      mockUsers.find(
        (u) =>
          u.id === request.studentId
      );

    const isOverdue =
      request.status ===
        'approved' &&
      request.dueDate &&
      new Date(request.dueDate) <
        new Date();

    const thumbnail =
      request.bookThumbnail ??
      book?.thumbnail;

    const title =
      request.bookTitle ??
      book?.title ??
      'Unknown Book';

    const studentName =
      request.studentName ??
      student?.name ??
      'Unknown Student';

    return (
      <Card className="hover:shadow-md transition-shadow">

        <CardContent className="p-4 sm:p-6">

          <div className="flex flex-col sm:flex-row gap-4">

            <div className="shrink-0">

              <img
                src={thumbnail}
                alt={title}
                className="w-full sm:w-24 h-32 sm:h-32 object-cover rounded-lg"
              />

            </div>

            <div className="flex-1 space-y-3 min-w-0">

              <div>

                <div className="flex flex-wrap items-start justify-between gap-2">

                  <h3 className="font-semibold text-base sm:text-lg truncate">
                    {title}
                  </h3>

                  {getStatusBadge(
                    request.status
                  )}

                </div>

                <p className="text-sm text-muted-foreground">
                  {book?.author}
                </p>

              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">

                {isLibrarian && (

                  <div className="flex items-center gap-2 text-muted-foreground">

                    <User className="w-4 h-4 shrink-0" />

                    <span className="truncate">
                      {studentName}
                    </span>

                  </div>

                )}

                <div className="flex items-center gap-2 text-muted-foreground">

                  <Calendar className="w-4 h-4 shrink-0" />

                  <span>
                    Requested:
                    {' '}
                    {new Date(
                      request.requestDate
                    ).toLocaleDateString()}
                  </span>

                </div>

                {request.dueDate && (

                  <div
                    className={`flex items-center gap-2 ${
                      isOverdue
                        ? 'text-red-600 font-medium'
                        : 'text-muted-foreground'
                    }`}
                  >

                    <Clock className="w-4 h-4 shrink-0" />

                    <span>

                      Due:
                      {' '}
                      {new Date(
                        request.dueDate
                      ).toLocaleDateString()}

                      {isOverdue &&
                        ' — Overdue!'}

                    </span>

                  </div>

                )}

                {request.returnDate && (

                  <div className="flex items-center gap-2 text-muted-foreground">

                    <CheckCircle className="w-4 h-4 shrink-0" />

                    <span>

                      Returned:
                      {' '}
                      {new Date(
                        request.returnDate
                      ).toLocaleDateString()}

                    </span>

                  </div>

                )}

              </div>

              <div className="flex flex-wrap gap-2 pt-1">

                {isLibrarian ? (
                  <>

                    {request.status ===
                      'pending' && (
                      <>

                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() =>
                            handleApprove(
                              request.id
                            )
                          }
                        >

                          <CheckCircle className="w-4 h-4 mr-1" />

                          Approve

                        </Button>

                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() =>
                            handleDecline(
                              request.id
                            )
                          }
                        >

                          <XCircle className="w-4 h-4 mr-1" />

                          Decline

                        </Button>

                      </>
                    )}

                    {request.status ===
                      'approved' && (

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          handleMarkReturned(
                            request.id
                          )
                        }
                      >

                        <RotateCcw className="w-4 h-4 mr-1" />

                        Mark as Returned

                      </Button>

                    )}

                  </>
                ) : (
                  <>

                    {request.status ===
                      'pending' && (

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          handleCancelRequest(
                            request.id
                          )
                        }
                      >

                        <XCircle className="w-4 h-4 mr-1" />

                        Cancel Request

                      </Button>

                    )}

                    {request.status ===
                      'approved' && (

                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white"
                        onClick={() =>
                          handleMarkReturned(
                            request.id
                          )
                        }
                      >

                        <RotateCcw className="w-4 h-4 mr-1" />

                        Return Book

                      </Button>

                    )}

                  </>
                )}

              </div>

            </div>

          </div>

        </CardContent>

      </Card>
    );
  };

  // ─────────────────────────────────────────────
  // EMPTY STATE
  // ─────────────────────────────────────────────

  const EmptyState = ({
    message,
  }: {
    message: string;
  }) => (

    <Card>

      <CardContent className="p-12 text-center">

        <BookOpen className="w-12 h-12 mx-auto text-muted-foreground mb-3" />

        <p className="text-muted-foreground">
          {message}
        </p>

      </CardContent>

    </Card>
  );

  // ─────────────────────────────────────────────
  // UI
  // ─────────────────────────────────────────────

  return (
    <Layout>

      <div className="space-y-6">

        <div>

          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">

            {isLibrarian
              ? 'Manage Requests'
              : 'My Requests'}

          </h1>

          <p className="text-muted-foreground mt-1">

            {isLibrarian
              ? 'Review and manage book requests from students'
              : 'Track your book borrowing requests'}

          </p>

        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">

          {[
            {
              count:
                pendingRequests.length,
              label: 'Pending',
              color:
                'text-yellow-600',
            },
            {
              count:
                approvedRequests.length,
              label: 'Approved',
              color:
                'text-green-600',
            },
            {
              count:
                completedRequests.length,
              label: 'Completed',
              color:
                'text-blue-600',
            },
            {
              count:
                declinedRequests.length,
              label: 'Declined',
              color:
                'text-red-600',
            },
          ].map(
            ({
              count,
              label,
              color,
            }) => (

              <Card key={label}>

                <CardContent className="p-4 text-center">

                  <div
                    className={`text-2xl sm:text-3xl font-bold ${color}`}
                  >
                    {count}
                  </div>

                  <div className="text-xs sm:text-sm text-muted-foreground mt-1">
                    {label}
                  </div>

                </CardContent>

              </Card>
            )
          )}

        </div>

        <Tabs
          defaultValue="pending"
          className="space-y-4"
        >

          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">

            <TabsTrigger value="pending">
              Pending (
              {pendingRequests.length}
              )
            </TabsTrigger>

            <TabsTrigger value="approved">
              Approved (
              {approvedRequests.length}
              )
            </TabsTrigger>

            <TabsTrigger value="completed">
              Completed (
              {completedRequests.length}
              )
            </TabsTrigger>

            <TabsTrigger value="declined">
              Declined (
              {declinedRequests.length}
              )
            </TabsTrigger>

          </TabsList>

          <TabsContent
            value="pending"
            className="space-y-4"
          >

            {pendingRequests.length === 0
              ? (
                <EmptyState message="No pending requests" />
              )
              : pendingRequests.map(
                  (r) => (
                    <RequestCard
                      key={r.id}
                      request={r}
                    />
                  )
                )}

          </TabsContent>

          <TabsContent
            value="approved"
            className="space-y-4"
          >

            {approvedRequests.length === 0
              ? (
                <EmptyState message="No approved requests" />
              )
              : approvedRequests.map(
                  (r) => (
                    <RequestCard
                      key={r.id}
                      request={r}
                    />
                  )
                )}

          </TabsContent>

          <TabsContent
            value="completed"
            className="space-y-4"
          >

            {completedRequests.length === 0
              ? (
                <EmptyState message="No completed requests" />
              )
              : completedRequests.map(
                  (r) => (
                    <RequestCard
                      key={r.id}
                      request={r}
                    />
                  )
                )}

          </TabsContent>

          <TabsContent
            value="declined"
            className="space-y-4"
          >

            {declinedRequests.length === 0
              ? (
                <EmptyState message="No declined requests" />
              )
              : declinedRequests.map(
                  (r) => (
                    <RequestCard
                      key={r.id}
                      request={r}
                    />
                  )
                )}

          </TabsContent>

        </Tabs>

      </div>

    </Layout>
  );
}