# 🎯 Getting Started - Smart Vehicle Fuel Theft Detection System (Node.js)

## 👋 Welcome!

Your **Smart Vehicle Fuel Theft Detection System** has been successfully set up with **Node.js + Express.js** backend. This document shows you exactly what to do next.

---

## ⚡ Quick Start (3 Commands)

If you have Node.js and MySQL installed:

```powershell
# 1. Install dependencies (run once)
npm install

# 2. Setup database (run once)
mysql -u root -p < database/setup.sql

# 3. Start the server (run to launch)
npm start
```

Then open: **http://localhost:3000/index.html**

---

## 📋 What You're Getting

### ✅ System Components

1. **Frontend**: React single-page app (3 sample vehicles, real-time updates)
2. **Backend**: Node.js API server (12 endpoints, theft detection)
3. **Database**: MySQL with automatic theft detection trigger
4. **Documentation**: 15+ guides and references

### ✅ Key Features

- 🚔 **Automatic Theft Detection**: Monitors fuel level changes, locks vehicle if suspicious
- 📊 **Dashboard**: Real-time statistics and vehicle overview
- 🔐 **Vehicle Control**: Lock/unlock vehicles manually
- 🚨 **Alert System**: Get notified of fuel theft events
- 📈 **History Tracking**: View fuel consumption and theft history

---

## 🚀 Step-by-Step Installation

### Prerequisites Check

**1. Check Node.js**
```powershell
node --version
npm --version
```

**Should show version numbers like: v18.0.0 and 9.0.0**

If not installed, download from: https://nodejs.org/

**2. Check MySQL**
```powershell
mysql --version
```

**Should show something like: mysql Ver 8.0.35**

If not installed, download from: https://www.mysql.com/

**3. Ensure MySQL is Running**
- Windows: Services → MySQL → Running
- Or: Start MySQL Server from your installer (XAMPP/WAMP)

---

### Installation Steps

#### Step 1: Navigate to Project
```powershell
cd D:\DBMSCA3
```

#### Step 2: Install Dependencies
```powershell
npm install
```

**What this does**: Downloads express, mysql2, cors, dotenv packages
**Time**: 2-3 minutes
**Expected output**: "added X packages"

#### Step 3: Create Database
```powershell
mysql -u root -p < database/setup.sql
```

**What this does**: Creates database with all tables, triggers, procedures, sample data
**When prompted**: Enter your MySQL root password (or just press Enter if no password)
**Expected**: No errors shown

**Alternative (if MySQL CLI not found)**:
1. Open MySQL Workbench
2. File → Open SQL Script
3. Select `D:\DBMSCA3\database\setup.sql`
4. Execute (Ctrl+Shift+Enter)

#### Step 4: Configure (if needed)

Edit `.env` file if your MySQL credentials are different:
```
DB_HOST=localhost
DB_USER=root
DB_PASS=your_password_here
DB_NAME=smart_fuel_theft
PORT=3000
```

---

### Running the System

#### Start the Server
```powershell
cd D:\DBMSCA3
npm start
```

**Expected output**:
```
Server running on http://localhost:3000
Connected to MySQL database
✓ Connection pool ready
```

**In development (with auto-reload)**:
```powershell
npm run dev
```

#### Open in Browser

Navigate to: **http://localhost:3000/index.html**

You should see:
- Dashboard with statistics
- 3 sample vehicles listed
- Vehicle management interface
- Alerts and theft events tabs

---

## 🧪 Testing the System

### Test 1: View Dashboard
✅ Navigate to http://localhost:3000/index.html
✅ You see 3 vehicles in the list
✅ Dashboard shows statistics

### Test 2: Add a Vehicle
✅ Click "Add Vehicle" button
✅ Fill in: Owner Name, Registration, Model, Fuel Capacity
✅ Click Submit
✅ New vehicle appears in list

### Test 3: Test Theft Detection (Most Important!)
1. ✅ Go to **Vehicles** tab
2. ✅ Click **"Update Fuel"** on first vehicle (ABC-1234)
3. ✅ Change fuel from **5** to **2** liters
4. ✅ Click **Submit**

**Expected Results**:
- ✅ Success message appears
- ✅ Vehicle status changes to **LOCKED** (red)
- ✅ Go to **Alerts** tab → New alert appears
- ✅ Go to **Theft Events** tab → New event appears
- ✅ In database:
  ```sql
  SELECT * FROM FuelTheftEvents ORDER BY created_at DESC LIMIT 1;
  ```

### Test 4: Manual Lock/Unlock
✅ Click "Lock" on an unlocked vehicle → Status becomes red
✅ Click "Unlock" → Status becomes green

### Test 5: View Details
✅ Click vehicle name/details → Modal shows history
✅ View fuel consumption logs
✅ View theft history for that vehicle

---

## 📚 Documentation Guide

| Need | File | Read Time |
|------|------|-----------|
| **Quick start** | `QUICK_START_NODEJS.md` | 5 min |
| **API details** | `NODEJS_API_REFERENCE.md` | 10 min |
| **Deployment** | `NODEJS_DEPLOYMENT_CHECKLIST.md` | 10 min |
| **What changed** | `NODEJS_CONVERSION_SUMMARY.md` | 5 min |
| **All files** | `PROJECT_FILES_INVENTORY.md` | 10 min |

---

## 🔧 Troubleshooting

### ❌ "npm: command not found"
**Solution**: Install Node.js from https://nodejs.org/

### ❌ "Module not found"
**Solution**: Run `npm install` in `D:\DBMSCA3`

### ❌ "ECONNREFUSED - Cannot connect to MySQL"
**Solution**:
1. Check MySQL is running
2. Check credentials in `.env`
3. Verify database name is `smart_fuel_theft`

### ❌ "Port 3000 already in use"
**Solution**: Change PORT in `.env` to 8080 (or another number)

### ❌ "Database does not exist"
**Solution**: Run database setup:
```powershell
mysql -u root -p < D:\DBMSCA3\database\setup.sql
```

### ❌ "Page loads but no data"
**Solution**:
1. Check browser console (F12) for errors
2. Verify API calls in Network tab (should be 200 OK)
3. Check MySQL has data: `SELECT COUNT(*) FROM vehicles;`

---

## 🎯 What's Happening Behind the Scenes

### When You Start the Server
```
npm start
    ↓
Node.js runs backend/server.js
    ↓
Express.js starts on port 3000
    ↓
Creates connection pool to MySQL
    ↓
Serves http://localhost:3000/index.html (frontend)
    ↓
Waits for API requests from React app
```

### When You Update Fuel Level
```
Click "Update Fuel" in React app
    ↓
POST /api/updateFuelLevel with new fuel amount
    ↓
Node.js backend validates and executes SQL
    ↓
MySQL stored procedure processes update
    ↓
Trigger (detect_fuel_theft) automatically checks if theft
    ↓
If theft detected: Vehicle locks, alert created
    ↓
Response sent back to React app
    ↓
UI updates in real-time
```

### Database Trigger (Automatic)
```
Any fuel level update > 25% decrease
    ↓
Trigger fires automatically (no code needed)
    ↓
Creates record in FuelTheftEvents table
    ↓
Updates vehicle to LOCKED status
    ↓
Creates alert notification
```

---

## 📊 System Architecture

```
Your Browser
   ↓
http://localhost:3000/index.html
   ↓
React App (frontend/app.jsx)
   ├─ Dashboard tab
   ├─ Vehicles tab
   ├─ Alerts tab
   └─ Theft Events tab
   ↓
Fetch calls to API
   ↓
Node.js Express Server (backend/server.js)
   ├─ /api/getAllVehicles
   ├─ /api/getVehicle/:id
   ├─ /api/addVehicle
   ├─ /api/updateFuelLevel ← triggers theft detection
   ├─ /api/getFuelLogs/:id
   ├─ /api/getAlerts
   ├─ /api/getTheftEvents
   ├─ /api/getTheftHistory/:id
   ├─ /api/lockVehicle
   ├─ /api/unlockVehicle
   ├─ /api/getDashboardStats
   └─ /api/getVehicleFuelStatus
   ↓
MySQL Database (smart_fuel_theft)
   ├─ Vehicles table
   ├─ FuelSensor table
   ├─ FuelTheftEvents table
   ├─ FuelLogs table
   ├─ SecurityStatus table
   ├─ detect_fuel_theft trigger (automatic)
   └─ 6 stored procedures (business logic)
```

---

## 🎓 Understanding the Tech Stack

### React (Frontend)
- **What**: User interface library
- **Why**: Real-time updates, interactive UI
- **Your app**: 4 tabs, forms, modal dialogs

### Node.js + Express (Backend)
- **What**: JavaScript runtime + web framework
- **Why**: Easy to deploy, modern JavaScript, fast
- **Your server**: Handles all business logic, API requests

### MySQL (Database)
- **What**: Relational database
- **Why**: Reliable, structured data, advanced features
- **Your database**: Stores vehicles, sensors, events, alerts

---

## 🔑 Important Concepts

### REST API
- **GET**: Retrieve data (e.g., `GET /api/getAllVehicles`)
- **POST**: Create/update data (e.g., `POST /api/updateFuelLevel`)

### Async/Await
- **What**: Modern way to handle slow operations
- **Where**: Database queries in Node.js backend
- **Why**: Doesn't freeze, handles multiple requests

### Triggers
- **What**: Automatic actions in database
- **Yours**: `detect_fuel_theft` trigger
- **Does**: Locks vehicle, creates alert if fuel theft detected

### Connection Pool
- **What**: Group of reusable database connections
- **Why**: More efficient than creating new connection each time
- **Your setup**: 10 concurrent connections

---

## ✅ Verification Checklist

Before assuming everything works, verify:

- [ ] Node.js installed (`node --version` works)
- [ ] npm installed (`npm --version` works)
- [ ] MySQL running and accessible
- [ ] `npm install` completed without errors
- [ ] Database setup completed without errors
- [ ] Server started (`npm start` shows no errors)
- [ ] Browser shows http://localhost:3000/index.html (no 404)
- [ ] Dashboard displays 3 vehicles
- [ ] API calls in Network tab show 200 OK
- [ ] Fuel update triggers theft detection

---

## 🚀 Next Steps

### Now That You Have It Running:

1. **Explore the UI**
   - Click each tab
   - Try adding a vehicle
   - Try updating fuel levels

2. **Test Theft Detection**
   - Update fuel level with large decrease (> 25%)
   - Watch vehicle lock automatically
   - Check alerts appear

3. **Review the Code**
   - Look at `backend/server.js` to understand API logic
   - Look at `frontend/app.jsx` to understand UI logic
   - Look at `database/setup.sql` to understand database structure

4. **Customize (Optional)**
   - Change theft detection threshold
   - Add more features
   - Deploy to server

---

## 📞 Help & Support

### Quick Reference

| Issue | Command |
|-------|---------|
| Install dependencies | `npm install` |
| Start server | `npm start` |
| Start with auto-reload | `npm run dev` |
| Setup database | `mysql -u root -p < setup.sql` |
| Check Node version | `node --version` |
| Check npm version | `npm --version` |
| Check MySQL version | `mysql --version` |

### Documentation Files
- `QUICK_START_NODEJS.md` - 5-step quick start
- `NODEJS_DEPLOYMENT_CHECKLIST.md` - Comprehensive checklist
- `NODEJS_API_REFERENCE.md` - All 12 API endpoints
- `NODEJS_CONVERSION_SUMMARY.md` - What changed from PHP

---

## 🎉 Summary

**You now have**:
- ✅ Complete Smart Vehicle Fuel Theft Detection system
- ✅ Modern Node.js + React + MySQL stack
- ✅ 12 working API endpoints
- ✅ Automatic theft detection with database triggers
- ✅ Beautiful responsive UI with Bootstrap
- ✅ Sample data ready to test
- ✅ Comprehensive documentation

**To get started**:
```powershell
npm install
mysql -u root -p < database/setup.sql
npm start
```

Then open: http://localhost:3000/index.html

---

**Status**: ✅ Ready to use! Just follow the Quick Start commands above.

Questions? Check the documentation files in the project root. Each covers a specific aspect of the system.

Enjoy your Smart Vehicle Fuel Theft Detection System! 🚀
