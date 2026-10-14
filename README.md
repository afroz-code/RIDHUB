# RIDE HUB — Full Stack B.Sc. IT Project

**AI Powered Smart Bike Community & Marketplace**

## Included features

- Purple + black premium responsive theme
- Home / landing page
- Bike Explorer + used-bike marketplace
- **4 Sports bikes**
- **2 Adventure bikes**
- **2 Cruiser bikes**
- Additional naked bikes
- Local motorcycle showcase images for the demo listings (no external image host dependency)
- Search, category filter and maximum-price filter
- Working **View Details** modal for every bike
- Sell My Bike form
- EMI calculator
- Insurance estimator
- Fuel Expense Tracker
- **Service / PUC / Insurance Reminder Center**
- Riding events
- Rider community posts
- Login / Register with JWT
- User profile
- **Admin Dashboard**
- Admin user information table
- Admin statistics
- Admin event creation
- MySQL database
- Express REST API
- React + Vite frontend

## Folder structure

- `client/` — React frontend
- `server/` — Express + MySQL backend
- `server/schema.sql` — database tables
- `ADMIN-SETUP.txt` — admin activation instructions

## Windows setup

### 1. Database

Start MySQL and run:

```sql
SOURCE server/schema.sql;
```

Or open `server/schema.sql` in MySQL Workbench and execute it.

### 2. Server environment

Copy:

`server/.env.example`

to:

`server/.env`

Enter your MySQL username/password.

### 3. Install dependencies

From the project root:

```powershell
npm install
npm run install-all
```

If the client alone is being started:

```powershell
cd client
npm install
npm run dev
```

### 4. Start

Frontend:

```powershell
cd client
npm run dev
```

Backend, in another terminal:

```powershell
cd server
npm install
npm run dev
```

Frontend: `http://localhost:5173`

API: `http://localhost:5000`

API health check: `http://localhost:5000/api/health`

## Admin

Register normally, then in MySQL:

```sql
USE ridehub;
UPDATE users SET role='admin' WHERE email='YOUR_EMAIL';
```

Logout and login again. Click **Admin**.

## Important

Do not open `client/index.html` directly. Use Vite with `npm run dev`.

The project is intentionally kept understandable for a B.Sc. IT final-year demonstration rather than being over-engineered.


## Separate Admin Portal
Open `http://localhost:5173/admin.html` for the separate purple/black Admin Portal. The Admin link is visible in the website navigation, but only users with `role='admin'` can sign in. Buy Bikes and Sell Bike are also available in the navigation.

## Troubleshooting: `Failed to fetch`

1. Start MySQL and execute `server/schema.sql`.
2. Make sure `server/.env` exists and its DB password is correct.
3. Run `START-RIDE-HUB.bat` from the project folder.
4. Open `http://localhost:5000/api/health`. It should show `database: connected`.
5. Open `http://localhost:5173` for the website and `http://localhost:5173/admin.html` for the separate admin portal.

The bundled real bike photo files are named `bmw-g310rr.jpg`, `himalayan450.jpg`, `hunter350.jpg`, and `super-meteor650.jpg`. Other bike cards still use the local illustrated SVG placeholders until matching real photos are added.
