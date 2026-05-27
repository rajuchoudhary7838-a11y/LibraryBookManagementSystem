import { useState, useEffect } from 'react';
import { useAuth } from '../lib/AuthContext';
import { mockFines, Fine } from '../lib/mockData';
import { finesApi, ApiFine } from '../lib/api';
import Layout from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { DollarSign, CheckCircle, AlertCircle, CreditCard, Calendar } from 'lucide-react';
import { toast } from 'sonner';

export default function FinesPage() {
  const { user, isApiConnected, hasCheckedApi } = useAuth();
  const [fines, setFines] = useState<Fine[]>([]);

  useEffect(() => {
    if (!hasCheckedApi || !user) return;

    if (isApiConnected) {
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
      setFines(mockFines.filter((f) => f.studentId === user?.id));
    }
  }, [hasCheckedApi, isApiConnected, user]);

  const handlePayFine = async (fineId: string) => {
    if (!hasCheckedApi || isApiConnected) {
      try {
        const paidFine = await finesApi.pay(fineId);
        setFines((prev) =>
          prev.map((fine) =>
            fine.id === paidFine.id
              ? {
                  id: paidFine.id,
                  studentId: paidFine.student_id,
                  amount: paidFine.amount,
                  status: paidFine.status,
                  paymentDate: paidFine.payment_date,
                  reason: paidFine.reason,
                }
              : fine
          )
        );
        toast.success('Payment successful!');
        return;
      } catch (e: any) {
        toast.error(e.message || 'Failed to pay fine');
        return;
      }
    }

    setFines(
      fines.map((fine) =>
        fine.id === fineId
          ? {
              ...fine,
              status: 'paid' as const,
              paymentDate: new Date().toISOString().split('T')[0],
            }
          : fine
      )
    );
    toast.success('Payment successful!');
  };

  const pendingFines = fines.filter((f) => f.status === 'pending');
  const paidFines = fines.filter((f) => f.status === 'paid');
  const totalPending = pendingFines.reduce((sum, fine) => sum + fine.amount, 0);
  const totalPaid = paidFines.reduce((sum, fine) => sum + fine.amount, 0);

  const FineCard = ({ fine }: { fine: Fine }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
          <div className="flex-1 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                  <h3 className="font-semibold">Fine Due</h3>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{fine.reason}</p>
              </div>
              <Badge variant={fine.status === 'paid' ? 'default' : 'destructive'}>
                {fine.status === 'paid' ? 'Paid' : 'Pending'}
              </Badge>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <DollarSign className="w-4 h-4" />
                <span className="font-medium text-foreground text-lg">${fine.amount.toFixed(2)}</span>
              </div>
              {fine.paymentDate && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>Paid: {new Date(fine.paymentDate).toLocaleDateString()}</span>
                </div>
              )}
            </div>

            {fine.status === 'pending' && (
              <Button
                size="sm"
                onClick={() => handlePayFine(fine.id)}
                className="w-full sm:w-auto bg-primary hover:bg-primary/90"
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Pay Now
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Fines & Payments</h1>
          <p className="text-muted-foreground mt-1">Manage your library fines and payment history</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-full bg-red-100 text-red-600">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Pending</p>
                  <p className="text-2xl font-bold">${totalPending.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-full bg-green-100 text-green-600">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Paid</p>
                  <p className="text-2xl font-bold">${totalPaid.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                  <DollarSign className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">All Time Total</p>
                  <p className="text-2xl font-bold">${(totalPending + totalPaid).toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {totalPending > 0 && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-6 h-6 text-red-600 shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-red-900">Outstanding Balance</h3>
                    <p className="text-sm text-red-700">
                      You have ${totalPending.toFixed(2)} in pending fines. Please pay to continue borrowing books.
                    </p>
                  </div>
                </div>
                <Button
                  className="w-full sm:w-auto bg-red-600 hover:bg-red-700"
                  onClick={() => {
                    pendingFines.forEach((fine) => handlePayFine(fine.id));
                  }}
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Pay All (${totalPending.toFixed(2)})
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="pending" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="pending">Pending ({pendingFines.length})</TabsTrigger>
            <TabsTrigger value="paid">Paid ({paidFines.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-4">
            {pendingFines.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <CheckCircle className="w-12 h-12 mx-auto text-green-600 mb-3" />
                  <h3 className="font-semibold mb-1">No Pending Fines</h3>
                  <p className="text-sm text-muted-foreground">
                    You're all caught up! No outstanding payments.
                  </p>
                </CardContent>
              </Card>
            ) : (
              pendingFines.map((fine) => <FineCard key={fine.id} fine={fine} />)
            )}
          </TabsContent>

          <TabsContent value="paid" className="space-y-4">
            {paidFines.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <DollarSign className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                  <h3 className="font-semibold mb-1">No Payment History</h3>
                  <p className="text-sm text-muted-foreground">
                    You haven't made any payments yet.
                  </p>
                </CardContent>
              </Card>
            ) : (
              paidFines.map((fine) => <FineCard key={fine.id} fine={fine} />)
            )}
          </TabsContent>
        </Tabs>

        <Card>
          <CardHeader>
            <CardTitle>Fine Policy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p>
              <strong>Daily Fine:</strong> $1.00 per day for overdue books
            </p>
            <p>
              <strong>Maximum Fine:</strong> $25.00 per book
            </p>
            <p>
              <strong>Grace Period:</strong> 2 days after due date before fines begin
            </p>
            <p className="text-muted-foreground">
              Fines must be paid before borrowing additional books. Contact the library for payment
              plans or dispute resolution.
            </p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
