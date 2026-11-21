# Lead Manager – Full Stack Developer Screening Assignment

**Candidate Submission for Meru Technosoft Pvt. Ltd.**  
**Candidate Name:** Reshma Kattubadi  
**Repository:** [https://github.com/reshma-kattubadi/lead-manager](https://github.com/reshma-kattubadi/lead-manager)

A production-ready, full-stack **Lead Manager** web application built with the **MERN** stack (MongoDB, Express.js, React.js, Node.js) and Tailwind CSS. The app enables sales teams to capture, qualify, search, filter, and manage sales leads through an intuitive, responsive CRM dashboard.

---

## 📑 Table of Contents
1. [Assignment Requirements & Status](#1-assignment-requirements--status)
2. [Tech Stack & Why It Was Chosen](#2-tech-stack--why-it-was-chosen)
3. [Project Architecture & Directory Structure](#3-project-architecture--directory-structure)
4. [Database Design, Schema & Indexing](#4-database-design-schema--indexing)
5. [REST API Documentation](#5-rest-api-documentation)
6. [Getting Started (Local Installation & Seeding)](#6-getting-started-local-installation--seeding)
7. [MongoDB Configuration Guide (Atlas & Embedded Fallback)](#7-mongodb-configuration-guide-atlas--embedded-fallback)
8. [Automated Testing & Verification](#8-automated-testing--verification)
9. [Deployment Guide (Vercel & Render)](#9-deployment-guide-vercel--render)
10. [Key Assumptions Made](#10-key-assumptions-made)
11. [Note on Proud Achievements & Challenges](#11-note-on-proud-achievements--challenges)
12. [What Would Be Improved With More Time](#12-what-would-be-improved-with-more-time)
13. [Design Decisions & Technical Interview Talking Points](#13-design-decisions--technical-interview-talking-points)

---

## 1. Assignment Requirements & Status

### Compulsory Requirements (100% Complete)
- [x] **1. Add Lead**: Capture `name`, `email`, `phone`, `company`, `source` (dropdown), and `status` (`New` / `Contacted` / `Qualified` / `Lost`).
- [x] **2. Display Leads Table**: Clean responsive table clearly displaying all contact information and color-coded status badges.
- [x] **3. Edit Lead Details**: Update lead details and stage status with real-time feedback and optimistic updates.
- [x] **4. Delete Lead (with Confirmation)**: Permanent deletion with a safe two-step confirmation modal (`DeleteModal.jsx`).
- [x] **5. Search & Filter**: Real-time search by name, company, or email with debouncing (300ms), plus instant status filtering dropdown.
- [x] **6. Two-Way Validation**: Comprehensive frontend validation (real-time feedback) and backend Mongoose/middleware validation (format checks, regex, enums).

### Bonus Features Included (From Assignment Section 2)
- [x] **Pagination & Interactive Sorting**: Server-side pagination with configurable page size (5, 10, 25, 50) and multi-column sorting (Name, Company, Status, Created Date).
- [x] **CSV Data Export**: One-click export of current filtered pipeline leads directly into `.csv`.
- [x] **Database Seeder Script**: Automated command (`npm run seed`) to quickly populate realistic sample pipeline records for demonstration.
- [x] **Dashboard Metric Cards**: Live lead counter and distribution breakdown (`Total`, `New`, `Contacted`, `Qualified`, `Lost`) that update automatically.
- [x] **Automated Test Suite**: 56 unit, integration, and live end-to-end test steps covering schema validation, middleware, error handlers, pagination, and controller methods (`npm test`).
- [x] **Optimistic UI Updates**: Instant table status updates with rollback protection upon API error.
- [x] **Deployment Ready**: Production configs for Vercel (`vercel.json`) and Render (`render.yaml`).

---

## 2. Tech Stack & Why It Was Chosen

| Layer | Technology | Key Libraries / Frameworks | Why This Stack Was Chosen |
| :--- | :--- | :--- | :--- |
| **Frontend** | React.js (v18) + Vite | Tailwind CSS, Lucide React (icons), Axios | **Vite + React** delivers fast hot-module replacement and clean component modularity. **Tailwind CSS** enables a modern, accessible CRM interface with zero runtime CSS bloat. |
| **Backend** | Node.js (v24) + Express.js | Mongoose (v8), CORS, Dotenv, Nodemon | **Node + Express** provides a lightweight, non-blocking asynchronous event loop ideal for REST microservices and predictable middleware chaining. |
| **Database** | MongoDB | MongoDB Atlas (Cloud) / Local / Embedded | **MongoDB + Mongoose** pairs flexible BSON documents with strict schema-level validation, compound indexing for queries, and native aggregation pipelines for live metric counters. |
| **Testing** | Node Test Harness | Supertest, Assert, Embedded Test Server | **Supertest + Node Assert** enables fast, zero-dependency unit and integration testing without requiring external test runners. |

---

## 3. Project Architecture & Directory Structure

```text
lead-manager/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                 # Mongoose connection with embedded fallback & auto-seeder
│   │   ├── controllers/
│   │   │   └── leadController.js     # REST business logic (CRUD, Search, Filter, Stats, Pagination)
│   │   ├── middleware/
│   │   │   ├── errorHandler.js       # Centralized 404, CastError, and ValidationError handlers
│   │   │   └── validateLead.js       # Request body validation middleware
│   │   ├── models/
│   │   │   └── Lead.js               # Mongoose schema, validation rules & compound indexes
│   │   ├── routes/
│   │   │   └── leadRoutes.js         # REST route definitions
│   │   ├── seeder.js                 # CLI seeder script (npm run seed / seed:destroy)
│   │   ├── app.js                    # Express app configuration & middleware pipeline
│   │   └── server.js                 # HTTP listener & process shutdown handler
│   ├── testLeadValidation.js         # Automated tests for schemas & middleware (22 tests)
│   ├── testControllers.js            # Automated tests for controllers & query builder (27 tests)
│   ├── testLiveServer.js             # Live end-to-end integration test against real MongoDB (7 steps)
│   ├── .env.example
│   ├── .env
│   ├── .gitignore
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx            # Top bar with live MongoDB record badge
│   │   │   ├── Sidebar.jsx           # Collapsible CRM navigation sidebar
│   │   │   ├── DashboardHeader.jsx   # Page title, refresh trigger, CSV export & "+ Add Lead" CTA
│   │   │   ├── StatCards.jsx         # Pipeline counters with click-to-filter
│   │   │   ├── SearchFilterBar.jsx   # Live search input, status/source filters & reset
│   │   │   ├── LeadTable.jsx         # Leads table with badges, sorting, pagination, edit/delete actions
│   │   │   ├── LeadModal.jsx         # Add / Edit modal form with field-level validation
│   │   │   ├── DeleteModal.jsx       # Compulsory delete confirmation modal
│   │   │   ├── Toast.jsx             # Auto-dismissing success/error toast alerts
│   │   │   └── EmptyState.jsx        # Context-aware empty state
│   │   ├── services/
│   │   │   └── api.js                # Axios client with base URL & error formatters
│   │   ├── App.jsx                   # Central state orchestration
│   │   ├── main.jsx                  # React DOM mount point
│   │   └── index.css                 # Tailwind CSS styles & animations
│   ├── .env.example
│   ├── .env
│   ├── .gitignore
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── vercel.json                   # Vercel SPA routing rewrite rules
│
├── render.yaml                       # Render backend deployment manifest
├── .gitignore                        # Root git ignore (keeps secrets out of git)
├── package.json
└── README.md
```

---

## 4. Database Design, Schema & Indexing

### Lead Schema (`backend/src/models/Lead.js`)

```javascript
{
  name: { type: String, required: true, trim: true, minlength: 2, maxlength: 100 },
  email: { type: String, required: true, lowercase: true, trim: true, match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
  phone: { type: String, required: true, trim: true, match: /^[+0-9\s\-()]{7,20}$/ },
  company: { type: String, required: true, trim: true, maxlength: 100 },
  source: { 
    type: String, 
    required: true, 
    enum: ['Website', 'Referral', 'LinkedIn', 'Cold Call', 'Email Campaign', 'Other'] 
  },
  status: { 
    type: String, 
    required: true, 
    enum: ['New', 'Contacted', 'Qualified', 'Lost'], 
    default: 'New' 
  },
  timestamps: true // createdAt, updatedAt
}
```

### Database Indexing Strategy:
- **Text Index**: `{ name: 'text', company: 'text' }` for scalable regex/text search across contact and company names.
- **Compound Index**: `{ status: 1, createdAt: -1 }` for instant retrieval when filtering by lead status sorted by newest first.

---

## 5. REST API Documentation

Base URL: `http://localhost:5000/api`

| Method | Endpoint | Description | Query Parameters / Request Body | Status Codes |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/leads` | List leads (with search, filter, sort & pagination) | `?search=john&status=New&sort=-createdAt&page=1&limit=10` | `200` |
| `GET` | `/leads/stats` | Pipeline stats breakdown | None | `200` |
| `GET` | `/leads/:id` | Fetch single lead | URL parameter `:id` | `200`, `400`, `404` |
| `POST` | `/leads` | Create new lead | JSON body: `{ name, email, phone, company, source, status }` | `201`, `400` |
| `PUT` | `/leads/:id` | Update lead | URL parameter `:id` + JSON update fields | `200`, `400`, `404` |
| `DELETE` | `/leads/:id` | Delete lead | URL parameter `:id` | `200`, `400`, `404` |
| `GET` | `/health` | API Healthcheck | None | `200` |

### Sample JSON Error Response:
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    { "field": "email", "message": "Please provide a valid email address (e.g. name@domain.com)" },
    { "field": "phone", "message": "Please provide a valid phone number (7-20 digits)" }
  ]
}
```

---

## 6. Getting Started (Local Installation & Seeding)

### Prerequisites:
- **Node.js**: v18 or v24+
- **npm**: v9+
- **MongoDB**: Either MongoDB Atlas (Cloud), a local MongoDB service, or zero-config mode (auto-embedded).

### Step 1: Clone the Repository
```bash
git clone https://github.com/reshma-kattubadi/lead-manager.git
cd lead-manager
```

### Step 2: Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment configuration from example
copy .env.example .env
```

Open `backend/.env` to configure your connection:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/lead_manager
CLIENT_URL=http://localhost:5173
```
*(Note: If local MongoDB is not running, the application will automatically spin up an embedded MongoDB server in development mode so you can evaluate the app immediately without extra setup!)*

Start the backend development server:
```bash
npm run dev
# Server will start on http://localhost:5000
```

*(Optional) Seed sample leads:*
```bash
# To populate 12 realistic sample leads across all statuses:
npm run seed

# To wipe seeded leads:
npm run seed:destroy
```

### Step 3: Frontend Setup
Open a new terminal window:
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create environment configuration from example
copy .env.example .env

# Start Vite development server
npm run dev
# Frontend will be accessible at http://localhost:5173
```

---

## 7. MongoDB Configuration Guide (Atlas & Embedded Fallback)

### Option A: Embedded MongoDB (Zero Configuration)
If you do not have MongoDB installed locally, you don't need to install anything! In development mode, `backend/src/config/db.js` automatically starts a local embedded MongoDB instance and auto-seeds initial records.

### Option B: MongoDB Atlas (Cloud Production Setup)
1. Sign in to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a free **M0 Sandbox** cluster.
3. Under **Database Access**, create a user with read/write permissions.
4. Under **Network Access**, add IP Address `0.0.0.0/0` (Allow Access from Anywhere).
5. Click **Connect** -> **Connect your application** -> Copy the connection string.
6. Replace `<username>` and `<password>` with your credentials in `backend/.env`:
   ```env
   MONGODB_URI=mongodb+srv://admin:YourPassword123@cluster0.mongodb.net/lead_manager?retryWrites=true&w=majority
   ```

### Option C: Local MongoDB Daemon
Ensure the local service is running on default port `27017`:
```bash
mongod --dbpath <path-to-data-dir>
```

---

## 8. Automated Testing & Verification

The project includes an automated test suite verifying all 6 compulsory assignment requirements:

```bash
cd backend
npm test
```

### Test Coverage Breakdown:
1. **Validation Test Suite (`testLeadValidation.js`)**: 22 tests verifying Mongoose schema constraints, email regex, phone formatting, enum restrictions, and middleware 400 responses.
2. **Controller Test Suite (`testControllers.js`)**: 27 tests verifying query construction, regex search, status filter, countDocuments pagination, and statistics aggregation.
3. **Live Server E2E Suite (`testLiveServer.js`)**: 7 live verification steps against real MongoDB verifying end-to-end CRUD, health check, and 404 handling.
- **Total Passing Tests**: `56 / 56 test steps passing`.

---

## 9. Deployment Guide (Vercel & Render)

### Backend Deployment (Render)
1. Push repository to GitHub.
2. Sign in to [Render](https://render.com) and click **New + Web Service**.
3. Select your repository:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. Add Environment Variables in Render:
   - `NODE_ENV`: `production`
   - `MONGODB_URI`: `<Your MongoDB Atlas connection URI>`
   - `CLIENT_URL`: `<Your Vercel Frontend URL>`

### Frontend Deployment (Vercel)
1. Sign in to [Vercel](https://vercel.com) and click **Add New Project**.
2. Select your repository:
   - **Root Directory**: `frontend`
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. Add Environment Variable:
   - `VITE_API_BASE_URL`: `https://<your-render-backend-url>/api`
4. Click **Deploy**. Single-page app routing is handled automatically by `vercel.json`.

---

## 10. Key Assumptions Made

1. **Lead Stage Lifecycle**: Assumed a modern, agile sales workflow where leads can freely transition between `New`, `Contacted`, `Qualified`, and `Lost` based on sales rep interaction, without rigid one-way transition locks.
2. **Contact Email & Phone Uniqueness**: Did not enforce a unique index constraint on email or phone, allowing scenarios where multiple distinct stakeholders work at the same organization or share a centralized front-desk phone number, while enforcing strict regex format validation.
3. **Tenancy & Auth Scope**: In alignment with the assignment philosophy (*"keep it simple and done rather than large and half-finished"*), core pipeline functionality, resilient error handling, and responsive UX were prioritized over multi-tenant authentication.

---

## 11. Note on Proud Achievements & Challenges

> **Particularly Proud of:**  
> Architecting a resilient, zero-configuration embedded database fallback alongside live Mongoose aggregation stats and debounced search, which ensures the application works out of the box for any evaluator without requiring manual external database configuration.
>
> **Found Tricky:**  
> Balancing optimistic UI updates with error rollback handling across rapid status changes, while ensuring that backend schema regex validators and frontend real-time touch events remain in sync.

---

## 12. What Would Be Improved With More Time

1. **User Authentication & RBAC**: Add JWT authentication with role-based access control so individual sales reps view only their assigned leads, while managers view team-wide metrics.
2. **Activity Timeline & Notes**: Add an activity audit log to each lead (e.g. call logs, meeting notes, follow-up reminders).
3. **Bulk CSV Import**: Complement the existing CSV export feature with a drag-and-drop CSV parser with column mapping and duplicate detection.
4. **Automated Visual E2E Tests**: Integrate Cypress or Playwright to run automated cross-browser regressions on mobile, tablet, and desktop viewports.

---

## 13. Design Decisions & Technical Interview Talking Points

1. **Separation of Concerns (`app.js` vs `server.js`)**:
   - `app.js` encapsulates the Express instance, CORS, middleware, and route mounting.
   - `server.js` manages port binding, graceful process shutdowns (`SIGTERM`/`SIGINT`), and the database connection.
   - *Advantage*: Enables automated testing with tools like Supertest without binding physical network sockets or risking port collision.
2. **Compound Indexing & Search**:
   - Implemented `{ name: 'text', company: 'text' }` and `{ status: 1, createdAt: -1 }` indexes in Mongoose to support scalable searches and sorted status filters as the database grows.
3. **Debounced Search Query**:
   - Implemented a 300ms debounce on the search input to prevent unnecessary API hammering on each keystroke while maintaining a fluid user experience.
4. **Optimistic UI Updates with Rollback**:
   - Quick status dropdown changes reflect immediately in the table UI. If an API failure occurs, the table automatically rolls back to the previous state and displays a clear error toast.
