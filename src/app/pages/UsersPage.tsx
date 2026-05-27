import { useState } from 'react';
import { mockUsers, mockRequests, User } from '../lib/mockData';
import Layout from '../components/Layout';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../components/ui/dialog';
import { Search, Mail, Phone, BookOpen, Ban, UserCheck } from 'lucide-react';
import { toast } from 'sonner';

export default function UsersPage() {
  const [users, setUsers] = useState(mockUsers.filter((u) => u.role === 'student'));
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSuspend = (userId: string) => {
    toast.success('User suspended successfully');
  };

  const handleActivate = (userId: string) => {
    toast.success('User activated successfully');
  };

  const getUserStats = (userId: string) => {
    const userRequests = mockRequests.filter((r) => r.studentId === userId);
    return {
      totalBorrowed: userRequests.filter((r) => r.status === 'approved').length,
      pending: userRequests.filter((r) => r.status === 'pending').length,
      returned: userRequests.filter((r) => r.status === 'returned').length,
    };
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Manage Users</h1>
          <p className="text-muted-foreground mt-1">View and manage student accounts</p>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-11"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredUsers.map((user) => {
            const stats = getUserStats(user.id);
            return (
              <Card
                key={user.id}
                className="hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedUser(user)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Avatar className="w-16 h-16 shrink-0">
                      <AvatarImage src={user.profileImage} />
                      <AvatarFallback className="bg-primary text-white text-lg">
                        {user.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h3 className="font-semibold truncate">{user.name}</h3>
                          <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                        </div>
                        <Badge variant="default" className="shrink-0">
                          Active
                        </Badge>
                      </div>

                      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                        <div>
                          <div className="text-lg font-bold text-primary">{stats.totalBorrowed}</div>
                          <div className="text-xs text-muted-foreground">Borrowed</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-yellow-600">{stats.pending}</div>
                          <div className="text-xs text-muted-foreground">Pending</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-green-600">{stats.returned}</div>
                          <div className="text-xs text-muted-foreground">Returned</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredUsers.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground">No users found matching your search.</p>
            </CardContent>
          </Card>
        )}

        {selectedUser && (
          <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>User Details</DialogTitle>
                <DialogDescription>View detailed user information and borrowing activity</DialogDescription>
              </DialogHeader>
              <div className="space-y-6 mt-4">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={selectedUser.profileImage} />
                    <AvatarFallback className="bg-primary text-white text-2xl">
                      {selectedUser.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-center sm:text-left">
                    <h2 className="text-2xl font-bold">{selectedUser.name}</h2>
                    <Badge variant="default" className="mt-2">
                      Active Student
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-secondary/30 rounded-lg">
                      <Mail className="w-5 h-5 text-muted-foreground shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs text-muted-foreground">Email</p>
                        <p className="font-medium truncate">{selectedUser.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-secondary/30 rounded-lg">
                      <Phone className="w-5 h-5 text-muted-foreground shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs text-muted-foreground">Phone</p>
                        <p className="font-medium">{selectedUser.phone || 'Not provided'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="p-3 bg-secondary/30 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <BookOpen className="w-5 h-5 text-primary" />
                        <p className="text-xs text-muted-foreground">Borrowing Activity</p>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-center">
                        {Object.entries(getUserStats(selectedUser.id)).map(([key, value]) => (
                          <div key={key}>
                            <div className="text-xl font-bold text-primary">{value}</div>
                            <div className="text-xs text-muted-foreground capitalize">
                              {key.replace('total', '')}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Button variant="outline" className="flex-1" onClick={() => setSelectedUser(null)}>
                    Close
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => handleSuspend(selectedUser.id)}
                  >
                    <Ban className="w-4 h-4 mr-2" />
                    Suspend Account
                  </Button>
                  <Button
                    className="flex-1 bg-primary hover:bg-primary/90"
                    onClick={() => handleActivate(selectedUser.id)}
                  >
                    <UserCheck className="w-4 h-4 mr-2" />
                    Activate Account
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
