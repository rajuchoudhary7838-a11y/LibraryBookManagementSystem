import { ReactNode, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router';
import { useAuth } from '../lib/AuthContext';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from './ui/sheet';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import {
  BookOpen,
  LayoutDashboard,
  Library,
  FileText,
  DollarSign,
  Settings,
  LogOut,
  Users,
  ClipboardList,
  BarChart3,
  Menu,
  Mail,
  Phone,
  User,
  Wifi,
  WifiOff,
} from 'lucide-react';
import { Badge } from './ui/badge';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { user, logout, isApiConnected, hasCheckedApi } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  const studentNavItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Library, label: 'Browse Books', path: '/books' },
    { icon: FileText, label: 'My Requests', path: '/requests' },
    { icon: DollarSign, label: 'Fines', path: '/fines' },
    { icon: Settings, label: 'Profile', path: '/profile' },
  ];

  const librarianNavItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Library, label: 'Manage Books', path: '/books' },
    { icon: ClipboardList, label: 'Requests', path: '/requests' },
    { icon: Users, label: 'Users', path: '/users' },
    { icon: BarChart3, label: 'Reports', path: '/reports' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  const navItems = user?.role === 'librarian' ? librarianNavItems : studentNavItems;

  const SidebarContent = () => (
    <>
      <div className="p-4 sm:p-6 flex items-center gap-3 border-b border-sidebar-border">
        <BookOpen className="w-6 sm:w-8 h-6 sm:h-8 text-accent" />
        <div>
          <h1 className="font-bold text-base sm:text-lg">Library</h1>
          <p className="text-xs text-sidebar-foreground/70">Management System</p>
        </div>
      </div>

      <nav className="flex-1 p-3 sm:p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <Link key={item.path} to={item.path} onClick={() => setMobileMenuOpen(false)}>
            <Button
              variant={isActive(item.path) ? 'default' : 'ghost'}
              className={`w-full justify-start gap-3 h-11 ${
                isActive(item.path)
                  ? 'bg-accent text-accent-foreground hover:bg-accent/90'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Button>
          </Link>
        ))}
      </nav>

      <div className="p-3 sm:p-4 border-t border-sidebar-border">
        <div
          className="flex items-center gap-3 p-3 bg-sidebar-accent rounded-lg cursor-pointer hover:bg-sidebar-accent/80 transition-colors"
          onClick={() => {
            setProfileDialogOpen(true);
            setMobileMenuOpen(false);
          }}
        >
          <Avatar className="w-10 h-10">
            <AvatarImage src={user?.profileImage} />
            <AvatarFallback className="bg-primary text-white">
              {user?.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.name}</p>
            <p className="text-xs text-sidebar-foreground/70 capitalize">{user?.role}</p>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 bg-sidebar text-sidebar-foreground flex-col">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="p-0 w-64 bg-sidebar text-sidebar-foreground">
          <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
          <SheetDescription className="sr-only">Main navigation sidebar</SheetDescription>
          <div className="flex flex-col h-full">
            <SidebarContent />
          </div>
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <header className="h-14 sm:h-16 border-b bg-card flex items-center justify-between px-4 sm:px-6 shrink-0">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </Button>
            <h2 className="text-base sm:text-xl font-semibold text-foreground truncate">
              {navItems.find((item) => isActive(item.path))?.label || 'Library'}
            </h2>
            <div
              title={!hasCheckedApi ? 'Checking backend status' : isApiConnected ? 'Django backend connected' : 'Using offline mock data'}
              className={`hidden sm:flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${
                !hasCheckedApi
                  ? 'bg-gray-50 text-gray-500 border border-gray-200'
                  : isApiConnected
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : 'bg-gray-50 text-gray-500 border border-gray-200'
              }`}
            >
              {!hasCheckedApi
                ? <>Checking...</>
                : isApiConnected
                  ? <><Wifi className="w-3 h-3" /> Backend</>
                  : <><WifiOff className="w-3 h-3" /> Offline</>
              }
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 sm:h-10 sm:w-10 rounded-full">
                <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                  <AvatarImage src={user?.profileImage} />
                  <AvatarFallback className="bg-primary text-white text-sm">
                    {user?.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div>
                  <p className="font-medium">{user?.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setProfileDialogOpen(true)}>
                <User className="mr-2 h-4 w-4" />
                View Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/profile')}>
                <Settings className="mr-2 h-4 w-4" />
                Profile Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-secondary/30">
          <div className="container mx-auto p-4 sm:p-6">{children}</div>
        </main>
      </div>

      {/* Profile View Dialog */}
      <Dialog open={profileDialogOpen} onOpenChange={setProfileDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Profile Information</DialogTitle>
            <DialogDescription>View your profile details and account information</DialogDescription>
          </DialogHeader>
          <div className="space-y-6 mt-4">
            <div className="flex flex-col items-center gap-3">
              <Avatar className="w-24 h-24">
                <AvatarImage src={user?.profileImage} />
                <AvatarFallback className="bg-primary text-white text-2xl">
                  {user?.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="text-center">
                <h2 className="text-xl font-bold">{user?.name}</h2>
                <Badge variant="default" className="mt-2 capitalize">
                  {user?.role}
                </Badge>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-secondary/30 rounded-lg">
                <Mail className="w-5 h-5 text-muted-foreground shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="font-medium truncate">{user?.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-secondary/30 rounded-lg">
                <Phone className="w-5 h-5 text-muted-foreground shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="font-medium">{user?.phone || 'Not provided'}</p>
                </div>
              </div>
            </div>

            <Button
              className="w-full"
              onClick={() => {
                setProfileDialogOpen(false);
                navigate('/profile');
              }}
            >
              Edit Profile
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
