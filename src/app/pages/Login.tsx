import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { useAuth } from '../lib/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { BookOpen, GraduationCap, Shield, Eye, EyeOff, ArrowRight, BookMarked, Users, BarChart3 } from 'lucide-react';
import { toast } from 'sonner';

type Role = 'student' | 'librarian';

const STUDENT_CREDENTIALS = { email: 'john@student.edu', password: 'password' };
const LIBRARIAN_CREDENTIALS = { email: 'sarah@library.edu', password: 'password' };

export default function Login() {
  const [selectedRole, setSelectedRole] = useState<Role>('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleRoleSwitch = (role: Role) => {
    setSelectedRole(role);
    setEmail('');
    setPassword('');
  };

  const handleQuickLogin = () => {
    const creds = selectedRole === 'student' ? STUDENT_CREDENTIALS : LIBRARIAN_CREDENTIALS;
    setEmail(creds.email);
    setPassword(creds.password);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) {
      toast.success(`Welcome back! Logged in as ${selectedRole}`);
      navigate('/dashboard');
    } else {
      toast.error('Invalid credentials. Use the Quick Login button to auto-fill demo credentials.');
    }
  };

  const isStudent = selectedRole === 'student';

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left Panel - Branding (hidden on mobile) */}
      <div
        className={`hidden lg:flex lg:w-1/2 xl:w-[55%] flex-col justify-between p-10 xl:p-16 transition-all duration-500 ${
          isStudent
            ? 'bg-gradient-to-br from-blue-600 to-blue-800'
            : 'bg-gradient-to-br from-amber-500 to-amber-700'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-xl">
            <BookOpen className="w-7 h-7 text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-lg leading-tight">LibraryMS</p>
            <p className="text-white/70 text-xs">Management System</p>
          </div>
        </div>

        <div className="space-y-8">
          <div>
            <div
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6 ${
                isStudent ? 'bg-white/20 text-white' : 'bg-white/20 text-white'
              }`}
            >
              {isStudent ? (
                <GraduationCap className="w-4 h-4" />
              ) : (
                <Shield className="w-4 h-4" />
              )}
              {isStudent ? 'Student Portal' : 'Admin Portal'}
            </div>
            <h2 className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-4">
              {isStudent ? (
                <>
                  Discover &amp;<br />
                  Borrow Books
                </>
              ) : (
                <>
                  Manage Your<br />
                  Library
                </>
              )}
            </h2>
            <p className="text-white/80 text-lg leading-relaxed">
              {isStudent
                ? 'Access thousands of books, track your borrowing history, and manage your library account all in one place.'
                : 'Oversee the entire library system — manage books, users, requests, fines, and generate insightful reports.'}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {isStudent ? (
              <>
                <div className="flex items-center gap-4 p-4 bg-white/10 rounded-xl backdrop-blur-sm">
                  <div className="p-2 bg-white/20 rounded-lg shrink-0">
                    <BookMarked className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">Browse & Request Books</p>
                    <p className="text-white/70 text-xs mt-0.5">Search from 1000+ titles and request instantly</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-white/10 rounded-xl backdrop-blur-sm">
                  <div className="p-2 bg-white/20 rounded-lg shrink-0">
                    <BarChart3 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">Track Your Activity</p>
                    <p className="text-white/70 text-xs mt-0.5">Monitor loans, due dates, and fines</p>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-4 p-4 bg-white/10 rounded-xl backdrop-blur-sm">
                  <div className="p-2 bg-white/20 rounded-lg shrink-0">
                    <BookOpen className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">Full Book Management</p>
                    <p className="text-white/70 text-xs mt-0.5">Add, edit, delete and manage inventory</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-white/10 rounded-xl backdrop-blur-sm">
                  <div className="p-2 bg-white/20 rounded-lg shrink-0">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">User &amp; Request Control</p>
                    <p className="text-white/70 text-xs mt-0.5">Approve requests, manage users and fines</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <p className="text-white/50 text-sm">
          © 2026 LibraryMS. All rights reserved.
        </p>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex flex-col justify-center px-6 py-10 sm:px-12 lg:px-16 xl:px-20 bg-white overflow-y-auto">
        {/* Mobile Logo */}
        <div className="flex items-center gap-3 mb-8 lg:hidden">
          <div
            className={`p-2 rounded-xl ${isStudent ? 'bg-blue-600' : 'bg-amber-500'}`}
          >
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="font-bold text-gray-900">LibraryMS</p>
            <p className="text-xs text-gray-500">Management System</p>
          </div>
        </div>

        <div className="w-full max-w-md mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back</h1>
            <p className="text-gray-500">Select your role and sign in to continue</p>
          </div>

          {/* Role Selection Toggle */}
          <div className="grid grid-cols-2 gap-3 mb-8">
            <button
              type="button"
              onClick={() => handleRoleSwitch('student')}
              className={`relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                isStudent
                  ? 'border-blue-600 bg-blue-50 shadow-sm shadow-blue-100'
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div
                className={`p-2.5 rounded-xl ${
                  isStudent ? 'bg-blue-600' : 'bg-gray-100'
                }`}
              >
                <GraduationCap
                  className={`w-6 h-6 ${isStudent ? 'text-white' : 'text-gray-400'}`}
                />
              </div>
              <div className="text-center">
                <p
                  className={`font-semibold text-sm ${
                    isStudent ? 'text-blue-700' : 'text-gray-500'
                  }`}
                >
                  Student
                </p>
                <p className={`text-xs mt-0.5 ${isStudent ? 'text-blue-500' : 'text-gray-400'}`}>
                  Browse &amp; borrow
                </p>
              </div>
              {isStudent && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-blue-600 rounded-full" />
              )}
            </button>

            <button
              type="button"
              onClick={() => handleRoleSwitch('librarian')}
              className={`relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                !isStudent
                  ? 'border-amber-500 bg-amber-50 shadow-sm shadow-amber-100'
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div
                className={`p-2.5 rounded-xl ${
                  !isStudent ? 'bg-amber-500' : 'bg-gray-100'
                }`}
              >
                <Shield
                  className={`w-6 h-6 ${!isStudent ? 'text-white' : 'text-gray-400'}`}
                />
              </div>
              <div className="text-center">
                <p
                  className={`font-semibold text-sm ${
                    !isStudent ? 'text-amber-700' : 'text-gray-500'
                  }`}
                >
                  Librarian
                </p>
                <p className={`text-xs mt-0.5 ${!isStudent ? 'text-amber-500' : 'text-gray-400'}`}>
                  Admin access
                </p>
              </div>
              {!isStudent && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-amber-500 rounded-full" />
              )}
            </button>
          </div>

          {/* Role context banner */}
          <div
            className={`flex items-center gap-3 p-3.5 rounded-lg mb-6 text-sm transition-all duration-300 ${
              isStudent
                ? 'bg-blue-50 border border-blue-100 text-blue-700'
                : 'bg-amber-50 border border-amber-100 text-amber-700'
            }`}
          >
            {isStudent ? (
              <GraduationCap className="w-4 h-4 shrink-0" />
            ) : (
              <Shield className="w-4 h-4 shrink-0" />
            )}
            <span>
              Signing in as{' '}
              <strong>{isStudent ? 'Student' : 'Librarian / Admin'}</strong>
            </span>
            <button
              type="button"
              onClick={handleQuickLogin}
              className={`ml-auto shrink-0 text-xs px-2.5 py-1 rounded-md font-medium transition-colors ${
                isStudent
                  ? 'bg-blue-100 hover:bg-blue-200 text-blue-700'
                  : 'bg-amber-100 hover:bg-amber-200 text-amber-700'
              }`}
            >
              Quick Login
            </button>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-gray-700 text-sm font-medium">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder={isStudent ? 'john@student.edu' : 'sarah@library.edu'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-gray-700 text-sm font-medium">
                  Password
                </Label>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-11 pr-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className={`w-full h-11 font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                isStudent
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-amber-500 hover:bg-amber-600 text-white'
              }`}
            >
              Sign In
              <ArrowRight className="w-4 h-4" />
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500">
            Don't have an account?{' '}
            <Link
              to="/register"
              className={`font-medium hover:underline ${
                isStudent ? 'text-blue-600' : 'text-amber-600'
              }`}
            >
              Register here
            </Link>
          </div>

          {/* Demo credentials hint */}
          <div
            className={`mt-6 p-4 rounded-xl border text-xs space-y-1 transition-all duration-300 ${
              isStudent
                ? 'bg-gray-50 border-gray-200 text-gray-500'
                : 'bg-gray-50 border-gray-200 text-gray-500'
            }`}
          >
            <p className="font-semibold text-gray-700 mb-2">Demo Credentials</p>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-blue-500" />
                Student
              </span>
              <span className="font-mono text-gray-600">john@student.edu</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-amber-500" />
                Librarian
              </span>
              <span className="font-mono text-gray-600">sarah@library.edu</span>
            </div>
            <p className="text-gray-400 mt-1">Password: any value works</p>
          </div>
        </div>
      </div>
    </div>
  );
}
