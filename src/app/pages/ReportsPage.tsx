import { useState } from 'react';
import Layout from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Download, TrendingUp, BookOpen, Users, DollarSign } from 'lucide-react';
import { toast } from 'sonner';

export default function ReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  const handleExport = (type: string) => {
    toast.success(`Exporting ${type} report...`);
  };

  const topBooks = [
    { title: 'Harry Potter and the Philosopher\'s Stone', borrows: 45, category: 'Fantasy' },
    { title: '1984', borrows: 38, category: 'Science Fiction' },
    { title: 'The Great Gatsby', borrows: 32, category: 'Classic Literature' },
    { title: 'Sapiens', borrows: 28, category: 'Non-Fiction' },
    { title: 'The Hobbit', borrows: 25, category: 'Fantasy' },
  ];

  const activeStudents = [
    { name: 'John Doe', email: 'john@student.edu', borrowed: 8 },
    { name: 'Jane Smith', email: 'jane@student.edu', borrowed: 7 },
    { name: 'Mike Johnson', email: 'mike@student.edu', borrowed: 6 },
    { name: 'Sarah Wilson', email: 'sarah@student.edu', borrowed: 5 },
    { name: 'Tom Brown', email: 'tom@student.edu', borrowed: 4 },
  ];

  const monthlyStats = [
    { month: 'Jan', issued: 120, returned: 115, overdue: 5 },
    { month: 'Feb', issued: 135, returned: 130, overdue: 5 },
    { month: 'Mar', issued: 150, returned: 142, overdue: 8 },
    { month: 'Apr', issued: 145, returned: 138, overdue: 7 },
    { month: 'May', issued: 160, returned: 148, overdue: 12 },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Reports & Analytics</h1>
            <p className="text-muted-foreground mt-1">View detailed library statistics and insights</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Last Week</SelectItem>
                <SelectItem value="month">Last Month</SelectItem>
                <SelectItem value="quarter">Last Quarter</SelectItem>
                <SelectItem value="year">Last Year</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={() => handleExport('PDF')} variant="outline" className="w-full sm:w-auto">
              <Download className="w-4 h-4 mr-2" />
              Export PDF
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Issued</p>
                  <p className="text-2xl font-bold">160</p>
                  <p className="text-xs text-green-600">+12% from last month</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-full bg-green-100 text-green-600">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Returned</p>
                  <p className="text-2xl font-bold">148</p>
                  <p className="text-xs text-green-600">+8% from last month</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-full bg-red-100 text-red-600">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Overdue</p>
                  <p className="text-2xl font-bold">12</p>
                  <p className="text-xs text-red-600">+3 from last month</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Fines Collected</p>
                  <p className="text-2xl font-bold">$245</p>
                  <p className="text-xs text-yellow-600">+15% from last month</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="books" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="books">Top Books</TabsTrigger>
            <TabsTrigger value="students">Active Students</TabsTrigger>
            <TabsTrigger value="trends">Monthly Trends</TabsTrigger>
          </TabsList>

          <TabsContent value="books" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Most Borrowed Books</CardTitle>
                <CardDescription>Books with highest circulation this period</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {topBooks.map((book, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white font-bold text-sm shrink-0">
                          {index + 1}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium truncate">{book.title}</p>
                          <p className="text-sm text-muted-foreground">{book.category}</p>
                        </div>
                      </div>
                      <div className="text-right shrink-0 ml-4">
                        <p className="font-bold text-primary">{book.borrows}</p>
                        <p className="text-xs text-muted-foreground">borrows</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="students" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Most Active Students</CardTitle>
                <CardDescription>Students with highest borrowing activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {activeStudents.map((student, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-accent text-accent-foreground font-bold text-sm shrink-0">
                          {index + 1}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium truncate">{student.name}</p>
                          <p className="text-sm text-muted-foreground truncate">{student.email}</p>
                        </div>
                      </div>
                      <div className="text-right shrink-0 ml-4">
                        <p className="font-bold text-accent">{student.borrowed}</p>
                        <p className="text-xs text-muted-foreground">books</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trends" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Statistics</CardTitle>
                <CardDescription>Borrowing trends over the last 5 months</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {monthlyStats.map((stat, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{stat.month}</span>
                        <span className="text-sm text-muted-foreground">
                          {stat.issued} issued / {stat.returned} returned
                        </span>
                      </div>
                      <div className="flex gap-2 h-8">
                        <div
                          className="bg-blue-500 rounded flex items-center justify-center text-xs text-white"
                          style={{ width: `${(stat.issued / 160) * 100}%` }}
                        >
                          {stat.issued}
                        </div>
                        <div
                          className="bg-green-500 rounded flex items-center justify-center text-xs text-white"
                          style={{ width: `${(stat.returned / 160) * 100}%` }}
                        >
                          {stat.returned}
                        </div>
                        {stat.overdue > 0 && (
                          <div
                            className="bg-red-500 rounded flex items-center justify-center text-xs text-white px-2"
                          >
                            {stat.overdue}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
