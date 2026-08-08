# 🌉 FoodBridge AI

FoodBridge AI connects food donors with receivers in real-time, leveraging AI-powered matching to reduce food waste and feed communities.

## Architecture

The project follows a clean decoupled MERN stack architecture:

```
React Frontend (Vite)
        │
        ▼ HTTP REST API (Axios + JWT)
Node.js + Express Backend
        │
        ▼ Mongoose ODM
MongoDB Database (foodbridge_db)
```

- **Frontend**: React 18 + Vite (Port `5173`)
- **Backend**: Node.js + Express (Port `5000`)
- **Database**: MongoDB via Mongoose ODM (`mongodb://127.0.0.1:27017/foodbridge_db`)

---

## 🔒 Phase 1 — Authentication System Documentation

### Roles Implemented
1. **`DONOR`**: Restaurants, caterers, grocery stores, and businesses with surplus food.
2. **`RECEIVER`**: Shelters, food banks, community kitchens, and NGOs receiving food donations.

---

### Authentication Features & Flow

#### 1. Role Selection & Registration Flow
- **Role Selection**: The user selects their role (`DONOR` or `RECEIVER`) via visually highlighted cards before filling out the registration form.
- **Donor Registration Fields**:
  - Name (`name`)
  - Email (`email`)
  - Password (`password` - hashed with bcrypt)
  - Organization / Business Name (`organizationName`)
  - Phone Number (`phone`)
  - Location (`address`, `city`, `lat`, `lng`)
  - Role stored as `"DONOR"`
- **Receiver Registration Fields**:
  - Organization Name (`organizationName`)
  - Contact Person (`contactPerson`)
  - Email (`email`)
  - Password (`password` - hashed with bcrypt)
  - Phone Number (`phone`)
  - Location (`address`, `city`, `lat`, `lng`)
  - Role stored as `"RECEIVER"`
  - Default `verificationStatus`: `"PENDING"`

#### 2. Password Hashing & Security
- Passwords are encrypted using **bcrypt** salt (`10` rounds) in Mongoose pre-save middleware prior to database storage.
- Raw passwords are never stored, logged, or returned in API responses.

#### 3. JWT Authentication & Protected Routes
- Upon successful registration or login, the backend issues a Signed **JWT Token** (`expiresIn: 30d`).
- The JWT payload contains `{ id, role }`.
- Frontend stores the token in `localStorage` and automatically sends `Authorization: Bearer <token>` header via Axios request interceptor.
- **Middleware**: [`backend/middleware/auth.middleware.js`](file:///c:/Projects/FOODBRIDGE%20AI/backend/middleware/auth.middleware.js) validates JWT tokens (`protect`) and enforces role-based access control (`authorize('DONOR')`, `authorize('RECEIVER')`).

#### 4. Login & Logout
- **Login (`POST /api/auth/login`)**: Verifies credentials via `bcrypt.compare()`, generates a fresh JWT token, and redirects the user to their role-specific dashboard placeholder.
- **Logout (`POST /api/auth/logout`)**: Clears `localStorage` auth state and redirects user to the sign-in view.

---

### Auth API Endpoints

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Registers a new `DONOR` or `RECEIVER` user | No |
| `POST` | `/api/auth/login` | Authenticates credentials and returns JWT token | No |
| `POST` | `/api/auth/logout` | Server logout endpoint | No |
| `GET` | `/api/auth/me` | Fetches current user profile | **Yes (Bearer JWT)** |
| `GET` | `/api/health` | Backend and MongoDB health status check | No |

---

## 🛠️ Environment Configuration

### Backend (`backend/.env`):
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/foodbridge_db
JWT_SECRET=foodbridge_ai_super_secret_jwt_key_2026
```

### Frontend (`frontend/.env`):
```env
VITE_API_URL=http://localhost:5000
```

---

## 🚀 Running the Application

### 1. Start Backend Server:
```bash
cd backend
npm run dev
```

### 2. Start Frontend Application:
```bash
cd frontend
npm run dev
```
Access the application at: `http://localhost:5173`
