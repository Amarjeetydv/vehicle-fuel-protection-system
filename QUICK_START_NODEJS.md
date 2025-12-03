# Smart Vehicle Fuel Theft Detection System - Node.js Quick Start Guide

## Overview
This system has been successfully transitioned from PHP to **Node.js with Express.js** for easier deployment. The architecture remains the same:
- **Frontend**: React 18 single-page application (SPA)
- **Backend**: Node.js + Express.js REST API
- **Database**: MySQL 5.7+ with advanced stored procedures and triggers

---

## ✅ Prerequisites

### 1. **Node.js and npm**
- Download from: https://nodejs.org/ (LTS version recommended)
- Verify installation:
  ```powershell
  node --version
  npm --version
  ```

### 2. **MySQL Server**
- Download from: https://www.mysql.com/downloads/mysql/
- Or use: MySQL Workbench, XAMPP, WAMP, or Docker
- **Important**: MySQL Server must be running on `localhost:3306`

### 3. **Project Files**
- Ensure all files are in: `D:\DBMSCA3\`
- Check these key files exist:
  - `backend/server.js` (Node.js API server)
  - `frontend/app.jsx` (React application)
  - `index.html` (HTML entry point)
  - `package.json` (Node.js dependencies)
  - `.env` (Configuration file)
  - `database/setup.sql` (Database schema)

---

## 🚀 Quick Start (5 Steps)

### Step 1: Install Node.js Dependencies
```powershell
cd D:\DBMSCA3
npm install
```
This installs: express, mysql2, cors, dotenv, nodemon

**Expected output**: "added X packages"

---

### Step 2: Set Up the Database (if not already done)

#### Option A: Using Command Line (Recommended)
```powershell
cd D:\DBMSCA3
mysql -u root -p < database/setup.sql
```
Enter your MySQL root password when prompted.

#### Option B: Using MySQL Workbench
1. Open MySQL Workbench
2. Connect to localhost (default credentials: user=root, no password)
3. Go to: File → Open SQL Script
4. Select: `D:\DBMSCA3\database\setup.sql`
5. Click Execute (Ctrl+Shift+Enter)

**Expected result**: Database `smart_fuel_theft` created with 6 tables and sample data

---

### Step 3: Configure Database Credentials (if needed)

Edit `.env` file in `D:\DBMSCA3`:
```
DB_HOST=localhost
DB_USER=root
DB_PASS=
DB_NAME=smart_fuel_theft
PORT=3000
NODE_ENV=development
```

**Note**: Adjust `DB_USER` and `DB_PASS` if your MySQL credentials are different.

---

### Step 4: Start the Node.js Server

#### For Production:
```powershell
cd D:\DBMSCA3
npm start
```

#### For Development (with auto-reload):
```powershell
cd D:\DBMSCA3
npm run dev
```

**Expected output**:
```
Server running on http://localhost:3000
Connected to MySQL database
```

---

### Step 5: Open in Browser

Navigate to: **http://localhost:3000/index.html**

You should see the Smart Vehicle Fuel Theft Detection dashboard with:
- 3 sample vehicles
- Dashboard statistics
- Vehicle management
- Alerts and theft events

---

## 🧪 Test the System

### Test Theft Detection (End-to-End)
1. Go to the **Vehicles** tab
2. Click **"Update Fuel"** on the first vehicle
3. Change fuel level from `5` to `2` liters (large decrease = theft detection)
4. Click **Submit**

**Expected behavior**:
- ✅ Vehicle automatically locks
- ✅ Alert appears in the Alerts tab
- ✅ Theft event recorded in Theft Events tab
- ✅ Database trigger executes automatically

### Test Other Features
- **Add Vehicle**: Create new vehicle entries
- **Lock/Unlock**: Manually control vehicle locks
- **View Details**: Click vehicle to see detailed history

---

## 📊 API Endpoints (for Reference)

All endpoints are hosted on: `http://localhost:3000/api/`

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/getAllVehicles` | GET | Get all vehicles |
| `/getVehicle/:id` | GET | Get single vehicle details |
| `/addVehicle` | POST | Add new vehicle |
| `/updateFuelLevel` | POST | Update fuel level (triggers theft detection) |
| `/getFuelLogs/:id` | GET | Get fuel history for vehicle |
| `/getAlerts` | GET | Get all active alerts |
| `/getTheftEvents` | GET | Get all theft events |
| `/getTheftHistory/:id` | GET | Get theft history for vehicle |
| `/lockVehicle` | POST | Lock vehicle |
| `/unlockVehicle` | POST | Unlock vehicle |
| `/getDashboardStats` | GET | Get dashboard statistics |
| `/getVehicleFuelStatus` | GET | Get fuel status for all vehicles |

---

## 🔧 Troubleshooting

### ❌ Error: "Cannot find module 'express'"
**Solution**: Run `npm install` again in `D:\DBMSCA3`

### ❌ Error: "ECONNREFUSED 127.0.0.1:3306"
**Solution**: 
- Check MySQL server is running
- Verify credentials in `.env` file
- Ensure port 3306 is not blocked

### ❌ Error: "Database 'smart_fuel_theft' does not exist"
**Solution**: Run the database setup script:
```powershell
mysql -u root -p < D:\DBMSCA3\database\setup.sql
```

### ❌ Port 3000 already in use
**Solution**: Either:
- Change `PORT` in `.env` file, OR
- Stop the process using port 3000

### ❌ CORS errors in browser console
**Solution**: This is normal during development. The backend serves both API and frontend files.

### ❌ Page loads but no data appears
**Solution**:
1. Check browser console (F12) for errors
2. Verify backend server is running
3. Verify database contains data: 
   ```sql
   SELECT COUNT(*) FROM vehicles;
   ```

---

## 📁 Project Structure

```
D:\DBMSCA3\
├── backend/
│   └── server.js           (Node.js Express API server)
├── frontend/
│   ├── app.jsx            (React SPA component)
│   └── styles.css         (CSS styling)
├── database/
│   └── setup.sql          (Database schema & sample data)
├── index.html             (HTML entry point)
├── package.json           (Node.js dependencies)
├── .env                   (Configuration)
├── QUICK_START_NODEJS.md  (This file)
└── docs/                  (Documentation files)
```

---

## 📖 System Features

### 1. **Automatic Theft Detection**
- Monitors fuel level changes
- Triggers lock if suspicious decrease detected
- Creates alert and theft event record

### 2. **Vehicle Management**
- Add new vehicles
- Track fuel consumption
- Manual lock/unlock

### 3. **Real-Time Alerts**
- Fuel theft alerts
- Vehicle status monitoring
- Theft history tracking

### 4. **Dashboard**
- Real-time statistics
- Vehicle fleet overview
- Alert summary

---

## 🛠️ Advanced Configuration

### Change Server Port
Edit `.env`:
```
PORT=8080
```

### Change Database
Edit `.env`:
```
DB_NAME=your_database_name
```

### Connect to Remote MySQL Server
Edit `.env`:
```
DB_HOST=192.168.1.100
DB_USER=admin
DB_PASS=password123
```

---

## 📝 Next Steps

1. ✅ Install Node.js dependencies (`npm install`)
2. ✅ Set up database (`mysql < setup.sql`)
3. ✅ Start server (`npm start`)
4. ✅ Open browser (`http://localhost:3000/index.html`)
5. ✅ Test system (update fuel level)

---

## 📞 Support

For issues:
1. Check **Troubleshooting** section above
2. Verify all **Prerequisites** are met
3. Check server logs (terminal output)
4. Review browser console (F12 → Console tab)

---

## ✨ Technology Stack

- **Frontend**: React 18, Bootstrap 5, HTML5, CSS3
- **Backend**: Node.js, Express.js
- **Database**: MySQL 5.7+
- **Build Tools**: npm, nodemon (development)
- **API**: RESTful with JSON responses

---

**System Status**: ✅ Production Ready

All components tested and integrated. Ready for deployment!
