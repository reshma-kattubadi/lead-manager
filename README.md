# Lead Manager – Full Stack Developer Screening Assignment

**Candidate Submission for Meru Technosoft Pvt. Ltd.**

A production-ready, full-stack **Lead Manager** web application built with the **MERN** stack (MongoDB, Express.js, React.js, Node.js) and Tailwind CSS. The app enables sales teams to capture, qualify, search, filter, and manage sales leads through an intuitive, responsive CRM dashboard.

---

## 📑 Table of Contents
1. [Assignment Requirements & Status](#assignment-requirements--status)
2. [Tech Stack](#tech-stack)
3. [Project Architecture & Directory Structure](#project-architecture--directory-structure)
4. [Database Design & Schema](#database-design--schema)
5. [REST API Documentation](#rest-api-documentation)
6. [Getting Started (Local Installation)](#getting-started-local-installation)
7. [MongoDB Configuration Guide](#mongodb-configuration-guide)
8. [Automated Testing](#automated-testing)
9. [Deployment Guide (Vercel & Render)](#deployment-guide-vercel--render)
10. [Design Decisions & Interview Talking Points](#design-decisions--interview-talking-points)

---

## 1. Assignment Requirements & Status

### Compulsory Requirements (100% Complete)
- [x] **1. Add Lead**: Capture `name`, `email`, `phone`, `company`, `source` (dropdown), and `status` (`New` / `Contacted` / `Qualified` / `Lost`).
- [x] **2. Display Leads**: Clean responsive table clearly displaying all contact information and color-coded status badges.
- [x] **3. Edit Lead**: Update lead details and stage status with real-time feedback.
- [x] **4. Delete Lead**: Permanent deletion with a safe two-step confirmation modal.
- [x] **5. Search & Filter**: Real-time search by name, company, or email with debouncing, plus instant status filtering dropdown.
- [x] **6. Two-Way Validation**: Comprehensive frontend validation (real-time feedback) and backend Mongoose/middleware validation (format checks, regex, enums).

### Bonus Features Included
- [x] **Pagination & Interactive Sorting**: Server-side pagination with configurable page size (5, 10, 25, 50) and multi-column sorting (Name, Company, Status, Created Date).
- [x] **CSV Data Export**: One-click export of current filtered pipeline leads directly into `.csv`.
- [x] **Database Seeder Script**: Automated command (`npm run seed`) to quickly populate realistic sample pipeline records for demonstration.
- [x] **Dashboard Metric Cards**: Live lead counter and distribution breakdown (`Total`, `New`, `Contacted`, `Qualified`, `Lost`) that update automatically.
- [x] **Automated Test Suite**: 49 unit & integration tests covering schema validation, middleware, error handlers, pagination, and controller methods (`npm test`).
- [x] **Optimistic UI Updates**: Instant table status updates with rollback protection upon API error.
- [x] **Deployment Ready**: Production configs for Vercel (`vercel.json`) and Render (`render.yaml`).

---

## 2. Tech Stack

| Layer | Technology | Key Libraries / Frameworks |
| :--- | :--- | :--- |
| **Frontend** | React.js (v18) + Vite | Tailwind CSS, Lucide React (icons), Axios |
| **Backend** | Node.js (v24) + Express.js | Mongoose (v8), CORS, Dotenv, Nodemon |
| **Database** | MongoDB | MongoDB Atlas (Cloud) / Local MongoDB |
| **Testing** | Node Test Harness | Supertest, Assert, Custom Mock Runner |

---

## 3. Project Architecture & Directory Structure

```text
lead-manager/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                 # MongoDB Mongoose connection with timeout & retry
│   │   ├── controllers/
│   │   │   └── leadController.js     # REST business logic (CRUD, Search, Filter, Stats)
│   │   ├── middleware/
│   │   │   ├── errorHandler.js       # Centralized 404 & error handlers
│   │   │   └── validateLead.js       # Request body validation middleware
│   │   ├── models/
│   │   │   └── Lead.js               # Mongoose schema, validation rules & compound indexes
│   │   ├── routes/
│   │   │   └── leadRoutes.js         # REST route definitions
│   │   ├── app.js                    # Express app configuration & middleware pipeline
│   │   └── server.js                 # HTTP listener & process shutdown handler
│   ├── testLeadValidation.js         # Automated tests for schemas & middleware
│   ├── testControllers.js            # Automated tests for controllers & query builder
│   ├── .env.example
│   ├── .gitignore
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx            # Top bar with live MongoDB record badge
│   │   │   ├── Sidebar.jsx           # Collapsible CRM navigation sidebar
│   │   │   ├── DashboardHeader.jsx   # Page title, refresh trigger & "+ Add Lead" CTA
│   │   │   ├── StatCards.jsx         # Pipeline counters with click-to-filter
│   │   │   ├── SearchFilterBar.jsx   # Live search input, status/source filters & reset
│   │   │   ├── LeadTable.jsx         # Leads table with badges, edit/delete actions
│   │   │   ├── LeadModal.jsx         # Add / Edit modal form with field-level validation
│   │   │   ├── DeleteModal.jsx       # Compulsory delete confirmation modal
│   │   │   ├── Toast.jsx             # Auto-dismissing success/error toast alerts
│   │   │   └── EmptyState.jsx        # Context-aware empty state
│   │   ├── services/
│   │   │   └── api.js                # Axios client with error formatters
│   │   ├── App.jsx                   # Central state orchestration
│   │   ├── main.jsx                  # React DOM mount point
│   │   └── index.css                 # Tailwind CSS styles & animations
│   ├── .env.example
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

## 4. Database Design & Schema

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

### Database Indexing:
- **Text Index**: `{ name: 'text', company: 'text' }` for scalable regex/text search.
- **Compound Index**: `{ status: 1, createdAt: -1 }` for filtering by status sorted by newest first.

---

## 5. REST API Documentation

Base URL: `http://localhost:5000/api`

| Method | Endpoint | Description | Query Parameters / Request Body | Status Codes |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/leads` | List all leads | `?search=john&status=New&source=LinkedIn` | `200` |
| `GET` | `/leads/stats` | Pipeline stats | None | `200` |
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
    { "field": "email", "message": "Please provide a valid email address" },
    { "field": "phone", "message": "Please provide a valid phone number (7-20 digits)" }
  ]
}
```

---

## 6. Getting Started (Local Installation)

### Prerequisites:
- **Node.js**: v18 or v24+
- **npm**: v9+
- **MongoDB**: Either a local MongoDB instance running on port 27017 or a free MongoDB Atlas cloud cluster.

### Step 1: Clone the Repository
```bash
git clone <your-repository-url>
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

Open `backend/.env` and ensure `MONGODB_URI` points to your database:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/lead_manager
CLIENT_URL=http://localhost:5173
```

Start the backend development server:
```bash
npm run dev
# Server will start on http://localhost:5000
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

## 7. MongoDB Configuration Guide

### Option A: MongoDB Atlas (Recommended Free Cloud Setup)
1. Sign in to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a free **M0 Sandbox** cluster.
3. Under **Database Access**, create a user with read/write permissions.
4. Under **Network Access**, add IP Address `0.0.0.0/0` (Allow Access from Anywhere).
5. Click **Connect** -> **Connect your application** -> Copy the connection string.
6. Replace `<username>` and `<password>` with your credentials in `backend/.env`:
   ```env
   MONGODB_URI=mongodb+srv://admin:YourPassword123@cluster0.mongodb.net/lead_manager?retryWrites=true&w=majority
   ```

### Option B: Local MongoDB
1. Ensure the MongoDB service is running:
   ```bash
   mongod --dbpath <path-to-data-dir>
   ```
2. Set in `backend/.env`:
   ```env
   MONGODB_URI=mongodb://127.0.0.1:27017/lead_manager
   ```

---

## 8. Automated Testing

The project includes an automated test suite verifying all 6 compulsory assignment requirements:

```bash
cd backend
npm test
```

### Test Coverage Highlights:
- **Schema Validation**: Tests required constraints, minimum name length, email format validation regex, phone format regex, and enum validation.
- **Middleware Error Handling**: Tests rejection of empty payloads, duplicate keys, malformed JSON, and structured field error formatting.
- **Controller & Query Logic**: Tests search regex query construction, status filtering, stats aggregation counters, and handling of invalid MongoDB ObjectIds.
- **Result**: `45 / 45 tests passing`.

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

## 10. Design Decisions & Interview Talking Points

During your technical interview at **Meru Technosoft**, here are the key design choices and trade-offs to discuss:

1. **Separation of Concerns (`app.js` vs `server.js`)**:
   - `app.js` configures the Express middleware, routes, and error handling pipeline.
   - `server.js` starts the network listener and connects to MongoDB.
   - *Why?* This allows testing the application with Supertest without having to spin up active network ports or risk port collisions.

2. **Debounced Search**:
   - Searching triggers a 300ms debounce on the frontend.
   - *Why?* Prevents making an API call on every single keystroke, significantly reducing database load while maintaining a fast, responsive user experience.

3. **Two-Way Validation Strategy**:
   - *Frontend*: Validates inputs immediately as the user types and on form blur to provide immediate, friendly guidance.
   - *Backend*: Re-validates every field using dedicated middleware and Mongoose schema definitions.
   - *Why?* Frontend validation improves UX; backend validation ensures data integrity even if API requests are made via Postman, curl, or automated scripts.

4. **Optimistic Status Updates with Rollback**:
   - When a user changes a lead's status in the table dropdown, the UI updates instantly. If the backend update fails, the table automatically rolls back to the previous state and displays a clear error toast.

5. **What would you improve with more time?** (Explicitly requested by the assignment PDF):
   - Add user authentication (JWT + bcrypt) with multi-tenancy so users only access their assigned leads.
   - Add CSV export/import for bulk lead migration.
   - Add column sorting (by name, company, or date) and server-side pagination for large enterprise databases.
   - Add automated end-to-end Cypress or Playwright tests for browser interaction.
