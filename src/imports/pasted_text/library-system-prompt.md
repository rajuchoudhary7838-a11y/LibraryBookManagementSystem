Here’s a detailed and professional prompt you can use for AI website builders, Figma AI, Lovable, Bolt, Cursor, Replit AI, or any full-stack code generation tool:

---

# Library Book Management System – Full Stack Project Prompt

Create a modern, responsive, and user-friendly **Library Book Management System** with two roles:

* **Librarian/Admin**
* **Student/User**

The system should have a clean, premium, and modern UI with excellent UX principles.

## Tech Stack

### Frontend

* React.js (JavaScript)
* React Router
* Context API or Redux
* Axios / Fetch API
* Tailwind CSS or Material UI
* Responsive Design for desktop + mobile

### Backend

* Django + Django REST Framework (Python)
* JWT Authentication
* REST APIs
* PostgreSQL or SQLite
* CRUD Operations
* Role-based Access Control

---

# UI/UX Requirements

## Design System

Use the **60-30-10 color rule**:

* 60% White
* 30% Blue
* 10% Yellow

### UI Guidelines

* Minimal and modern design
* Clean dashboard layouts
* Card-based UI
* Proper spacing system
* Professional typography hierarchy
* Smooth hover animations
* Consistent button styles
* Easy navigation
* Good contrast and readability
* Mobile responsive layouts
* Sidebar navigation for dashboard
* Top navbar with notifications and profile
* Empty states and loading states
* Success/error toast messages
* Search and filter system
* Confirmation dialogs before delete actions

### UX Requirements

* Easy to understand flow
* User should always know the next action
* Fast navigation
* Accessible forms
* Better user onboarding
* Reduce unnecessary clicks
* Smart dashboard summaries
* Breadcrumb navigation
* Pagination for tables
* Skeleton loading effects

---

# Authentication System

## Roles

### 1. Librarian/Admin

### 2. Student/User

## Features

* Login
* Logout
* Register
* Forgot Password
* Reset Password
* JWT Authentication
* Protected Routes
* Role-based access

---

# Student Features

## Authentication

* Sign Up
* Login
* New Registration

## Dashboard

Student dashboard should show:

* Total issued books
* Pending requests
* Returned books
* Fine amount
* Recent activity
* Notifications
* Due dates

## Book Features

* Browse all books
* Search books
* Filter books by:

  * Category
  * Author
  * Availability
  * Publication
* View book details
* Book availability status

## Request System

Students can:

* Request book issue
* Request return
* Cancel pending requests
* See request status:

  * Pending
  * Approved
  * Declined
  * Returned

## Fine & Fees

* Fine calculation system
* Late return fine
* See fee payment status
* Payment history
* Due alerts

## History

* Previous requests
* Borrowing history
* Returned books history
* Fine history

## Profile

* Update profile
* Change password
* Upload profile image

---

# Librarian/Admin Features

## Dashboard

Admin dashboard should show:

* Total books
* Total students
* Issued books
* Pending requests
* Overdue books
* Fine collected
* Analytics charts
* Recent activity

## Request Management

Admin can:

* Preview requests
* Accept requests
* Decline requests
* Mark books returned
* Track incomplete requests
* View request history

## Book Management

CRUD functionality:

* Add books
* Update books
* Delete books
* Manage categories
* Upload book cover image
* Book stock management
* ISBN support

## Student/User Management

Admin can:

* Add users
* Edit users
* Delete users
* Suspend users
* View student activity
* Reset passwords

## Reports & Analytics

* Monthly reports
* Most borrowed books
* Active students
* Overdue reports
* Fine reports

---

# Database Tables / Models

Create proper normalized database tables/models for:

## User Table

* id
* name
* email
* password
* role
* phone
* profile_image
* created_at

## Books Table

* id
* title
* author
* category
* ISBN
* quantity
* available_quantity
* description
* image
* published_date

## Requests Table

* id
* student_id
* book_id
* request_type
* status
* request_date
* approved_date
* return_date

## Fine Table

* id
* student_id
* amount
* status
* payment_date

## Notifications Table

* id
* user_id
* message
* read_status
* created_at

---

# API Requirements

Create REST APIs for:

* Authentication
* Books CRUD
* Requests CRUD
* Fine management
* Dashboard stats
* Notifications
* Search and filtering

Use:

* Fetch API or Axios in React
* Token authentication
* API validation
* Error handling
* Proper HTTP status codes

---

# Additional Features (Important)

Add these advanced features too:

## Smart Features

* Real-time notifications
* Email notifications
* Book due reminders
* Dark mode toggle
* QR code for books
* Barcode support
* Export reports as PDF/Excel
* Activity logs
* Search suggestions
* Recently viewed books

## Security

* Password hashing
* Input validation
* CSRF protection
* Rate limiting
* Secure APIs

## Performance

* Lazy loading
* Pagination
* Optimized API calls
* Caching

## Accessibility

* Keyboard navigation
* Proper contrast ratio
* ARIA labels
* Responsive typography

---

# Pages Required

## Public Pages

* Landing page
* Login
* Register
* About library
* Contact page

## Student Pages

* Dashboard
* Browse books
* Request history
* Fine details
* Notifications
* Profile settings

## Admin Pages

* Dashboard
* Manage books
* Manage users
* Request approvals
* Reports
* Settings

---

# Expected Output

Generate:

* Complete frontend code in React.js
* Complete backend code in Django REST Framework
* API integration
* Database models
* Folder structure
* Responsive UI
* Reusable components
* Clean architecture
* Proper comments in code
* README setup instructions
* Environment configuration
* Deployment-ready project structure

Make the project look premium, modern, scalable, and industry-level with a strong focus on UI/UX and smooth user experience.
