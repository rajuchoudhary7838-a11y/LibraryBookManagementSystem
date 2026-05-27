import { useState } from 'react';
import Layout from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Separator } from '../components/ui/separator';
import { Save, Bell, Book, Mail, Shield } from 'lucide-react';
import { toast } from 'sonner';

export default function SettingsPage() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [overdueReminders, setOverdueReminders] = useState(true);
  const [newBookAlerts, setNewBookAlerts] = useState(false);
  const [dueDays, setDueDays] = useState('14');
  const [finePerDay, setFinePerDay] = useState('1.00');
  const [maxBooksPerStudent, setMaxBooksPerStudent] = useState('5');

  const handleSave = () => {
    toast.success('Settings saved successfully!');
  };

  return (
    <Layout>
      <div className="space-y-6 max-w-4xl">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-1">Manage your library system preferences</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" />
              <CardTitle>Notification Settings</CardTitle>
            </div>
            <CardDescription>Configure how you receive notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-0.5">
                <Label className="text-base">Email Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive email updates about library activities
                </p>
              </div>
              <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
            </div>
            <Separator />
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-0.5">
                <Label className="text-base">Overdue Reminders</Label>
                <p className="text-sm text-muted-foreground">
                  Send reminders for overdue books
                </p>
              </div>
              <Switch checked={overdueReminders} onCheckedChange={setOverdueReminders} />
            </div>
            <Separator />
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-0.5">
                <Label className="text-base">New Book Alerts</Label>
                <p className="text-sm text-muted-foreground">
                  Get notified when new books are added
                </p>
              </div>
              <Switch checked={newBookAlerts} onCheckedChange={setNewBookAlerts} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Book className="w-5 h-5 text-primary" />
              <CardTitle>Library Policies</CardTitle>
            </div>
            <CardDescription>Configure borrowing rules and policies</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="dueDays">Default Due Days</Label>
                <Select value={dueDays} onValueChange={setDueDays}>
                  <SelectTrigger id="dueDays">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">7 Days</SelectItem>
                    <SelectItem value="14">14 Days</SelectItem>
                    <SelectItem value="21">21 Days</SelectItem>
                    <SelectItem value="30">30 Days</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Number of days before a book is due
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxBooks">Max Books Per Student</Label>
                <Select value={maxBooksPerStudent} onValueChange={setMaxBooksPerStudent}>
                  <SelectTrigger id="maxBooks">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">3 Books</SelectItem>
                    <SelectItem value="5">5 Books</SelectItem>
                    <SelectItem value="7">7 Books</SelectItem>
                    <SelectItem value="10">10 Books</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Maximum number of books a student can borrow
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="finePerDay">Fine Per Day (USD)</Label>
              <Input
                id="finePerDay"
                type="number"
                step="0.50"
                value={finePerDay}
                onChange={(e) => setFinePerDay(e.target.value)}
                className="max-w-xs"
              />
              <p className="text-xs text-muted-foreground">
                Daily fine amount for overdue books
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-primary" />
              <CardTitle>Email Configuration</CardTitle>
            </div>
            <CardDescription>Configure email settings for notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="libraryEmail">Library Email</Label>
              <Input
                id="libraryEmail"
                type="email"
                placeholder="library@university.edu"
                defaultValue="library@university.edu"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="libraryName">Library Name</Label>
              <Input
                id="libraryName"
                type="text"
                placeholder="University Library"
                defaultValue="University Library"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              <CardTitle>Security Settings</CardTitle>
            </div>
            <CardDescription>Manage security and access control</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
              <Select defaultValue="30">
                <SelectTrigger id="sessionTimeout" className="max-w-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 Minutes</SelectItem>
                  <SelectItem value="30">30 Minutes</SelectItem>
                  <SelectItem value="60">60 Minutes</SelectItem>
                  <SelectItem value="120">120 Minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-0.5">
                <Label className="text-base">Require Password Change</Label>
                <p className="text-sm text-muted-foreground">
                  Force password change every 90 days
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button onClick={handleSave} size="lg" className="w-full sm:w-auto">
            <Save className="w-4 h-4 mr-2" />
            Save Settings
          </Button>
        </div>
      </div>
    </Layout>
  );
}
