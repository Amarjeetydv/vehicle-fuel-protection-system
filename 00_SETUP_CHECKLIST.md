# ✅ FINAL SETUP CHECKLIST - Node.js Version

## 🎯 Your Mission: Get the System Running

Follow this checklist to get your Smart Vehicle Fuel Theft Detection system up and running on localhost:3000

---

## PHASE 1: PRE-FLIGHT CHECK ✈️

### Prerequisites Verification

- [ ] **Windows OS** - You're on Windows ✓
- [ ] **PowerShell** - Open PowerShell (already available)
- [ ] **Project folder** - `D:\DBMSCA3` exists ✓
- [ ] **All files downloaded** - Run:
  ```powershell
  ls D:\DBMSCA3\backend\server.js
  ls D:\DBMSCA3\frontend\app.jsx
  ls D:\DBMSCA3\database\setup.sql
  ls D:\DBMSCA3\package.json
  ls D:\DBMSCA3\.env
  ```
  All should show file found ✓

---

## PHASE 2: INSTALL NODE.JS 📥

### 2.1: Check if Node.js is Installed
```powershell
node --version
npm --version
```

- [ ] Both commands return version numbers (e.g., v18.0.0, npm 9.0.0)
- [ ] **If YES**: Skip to Phase 3
- [ ] **If NO**: Download and install Node.js

### 2.2: Install Node.js (if needed)
1. [ ] Visit: https://nodejs.org/
2. [ ] Download: **LTS version** (recommended for production)
3. [ ] Run installer with default settings
4. [ ] **Restart PowerShell** after installation
5. [ ] Verify again:
   ```powershell
   node --version
   npm --version
   ```

---

## PHASE 3: VERIFY MYSQL 🗄️

### 3.1: Check MySQL Installation
```powershell
mysql --version
```

- [ ] Command returns MySQL version (e.g., mysql Ver 8.0.35)
- [ ] **If YES**: MySQL CLI is installed, verify server is running
- [ ] **If NO**: Install MySQL (see 3.2)

### 3.2: Verify MySQL Server is Running

**Option A: Using Services (Windows)**
1. [ ] Press `Win + R`
2. [ ] Type: `services.msc`
3. [ ] Find: **MySQL** (or MySQL80, MySQL57, etc.)
4. [ ] Status should be: **Running**
5. [ ] If not running: Right-click → Start

**Option B: Using XAMPP/WAMP**
1. [ ] Open XAMPP/WAMP control panel
2. [ ] MySQL should show: **Running** (green indicator)
3. [ ] If not running: Click Start

**Option C: Test Connection**
```powershell
mysql -u root -p
```
- [ ] Enter password when prompted (or just Enter if no password)
- [ ] If it connects: Type `exit` and continue
- [ ] If it fails: Check MySQL is running

---

## PHASE 4: INSTALL PROJECT DEPENDENCIES 📦

### 4.1: Navigate to Project
```powershell
cd D:\DBMSCA3
```

- [ ] Terminal now shows: `D:\DBMSCA3 PS>`

### 4.2: Install npm Packages
```powershell
npm install
```

- [ ] Process starts downloading packages
- [ ] **Wait 2-3 minutes** for completion
- [ ] Expected final message: `added X packages`
- [ ] Check for any red error messages (there shouldn't be any)

### 4.3: Verify Installation
```powershell
ls node_modules | Select-Object -First 10
```

- [ ] You should see folders: `express`, `mysql2`, `cors`, `dotenv`, `nodemon`

---

## PHASE 5: SETUP DATABASE 📊

### 5.1: Create Database from SQL Script

#### Method A: Using MySQL CLI (Recommended)
```powershell
mysql -u root -p < D:\DBMSCA3\database\setup.sql
```

- [ ] When prompted, enter MySQL root password (or press Enter if no password)
- [ ] Process completes without errors
- [ ] You see database created message

#### Method B: Using MySQL Workbench
1. [ ] Open MySQL Workbench
2. [ ] Connect to localhost
3. [ ] File → Open SQL Script
4. [ ] Select: `D:\DBMSCA3\database\setup.sql`
5. [ ] Execute: Ctrl+Shift+Enter
6. [ ] Script completes successfully

### 5.2: Verify Database Creation
```powershell
mysql -u root -p -e "SELECT COUNT(*) as vehicle_count FROM smart_fuel_theft.vehicles;"
```

- [ ] When prompted, enter MySQL password
- [ ] Result should show: `vehicle_count = 3`
- [ ] This confirms database setup successful ✓

---

## PHASE 6: VERIFY CONFIGURATION 🔧

### 6.1: Check `.env` File
```powershell
cat D:\DBMSCA3\.env
```

- [ ] Should show:
  ```
  DB_HOST=localhost
  DB_USER=root
  DB_PASS=
  DB_NAME=smart_fuel_theft
  PORT=3000
  ```

### 6.2: Adjust if Needed

**If MySQL has different credentials**, edit `.env`:
1. [ ] Open: `D:\DBMSCA3\.env` in text editor
2. [ ] Update credentials to match your MySQL setup
3. [ ] Save file

**If MySQL not on localhost**, update:
```
DB_HOST=your_mysql_host
```

---

## PHASE 7: START THE SERVER 🚀

### 7.1: Start in Production Mode
```powershell
cd D:\DBMSCA3
npm start
```

- [ ] Terminal shows:
  ```
  Server running on http://localhost:3000
  Connected to MySQL database
  ✓ Connection pool ready
  ```
- [ ] No red error messages
- [ ] Server is now running (leave this terminal open)

### 7.2: Alternative: Start in Development Mode (with auto-reload)
```powershell
npm run dev
```

- [ ] Same startup messages as above
- [ ] Server auto-reloads when files change
- [ ] **Recommended for testing**

---

## PHASE 8: ACCESS THE APPLICATION 🌐

### 8.1: Open Browser
- [ ] Open any browser (Chrome, Firefox, Edge, etc.)
- [ ] Navigate to: **http://localhost:3000/index.html**

### 8.2: Verify Application Loads
- [ ] Page loads successfully (no 404 error)
- [ ] You see the dashboard header
- [ ] Dashboard tab shows statistics
- [ ] Vehicle list shows 3 vehicles:
  - [ ] ABC-1234 (John Doe, Toyota Camry)
  - [ ] XYZ-5678 (Jane Smith, Honda Civic)
  - [ ] DEF-9012 (Bob Johnson, Ford Focus)

---

## PHASE 9: TEST CORE FUNCTIONALITY 🧪

### 9.1: Test Dashboard (No Data Yet)
- [ ] Click **Dashboard** tab
- [ ] Statistics visible (Total Vehicles, Alerts, Theft Events)
- [ ] Vehicle status: All should be UNLOCKED (green)

### 9.2: Test Vehicle List
- [ ] Click **Vehicles** tab
- [ ] 3 vehicles displayed
- [ ] Each vehicle shows: Name, Registration, Model, Fuel Level
- [ ] Buttons visible: Update Fuel, Lock, Unlock

### 9.3: Test Fuel Update (THIS IS THE CRITICAL TEST!)

**This tests the entire system including automatic theft detection**

1. [ ] In **Vehicles** tab, find first vehicle (ABC-1234)
2. [ ] Click **"Update Fuel"** button
3. [ ] Modal dialog appears
4. [ ] Select vehicle: **ABC-1234**
5. [ ] Enter fuel level: **2** (changes from 5 to 2 = 60% decrease = THEFT!)
6. [ ] Click **Submit**

**Expected Results**:
- [ ] Success message appears: "Fuel level updated!"
- [ ] Modal closes
- [ ] Vehicle status changes to: **LOCKED** (red badge)
- [ ] Go to **Alerts** tab → See new alert
- [ ] Go to **Theft Events** tab → See new theft event
- [ ] **Database check**:
  ```powershell
  mysql -u root -p -e "SELECT * FROM smart_fuel_theft.FuelTheftEvents ORDER BY created_at DESC LIMIT 1;"
  ```
  - [ ] Should show latest theft event for vehicle 1

**If all above work**: ✅ **SYSTEM IS FULLY FUNCTIONAL!**

### 9.4: Test Manual Lock/Unlock
- [ ] In **Vehicles** tab, find an UNLOCKED vehicle (green status)
- [ ] Click **"Lock"** button
- [ ] Vehicle status changes to **LOCKED** (red)
- [ ] Click **"Unlock"** button
- [ ] Vehicle status changes back to **UNLOCKED** (green)

### 9.5: Test Add Vehicle
- [ ] Click **Add Vehicle** button
- [ ] Fill form:
  - [ ] Owner Name: `Test Owner`
  - [ ] Registration: `TST-0001`
  - [ ] Model: `Test Model`
  - [ ] Fuel Capacity: `50`
- [ ] Click **Submit**
- [ ] Success message
- [ ] New vehicle appears in list

### 9.6: Test Vehicle Details
- [ ] Click on any vehicle (click the row or details link)
- [ ] Modal appears showing:
  - [ ] Vehicle information
  - [ ] Fuel consumption history
  - [ ] Theft history for this vehicle

---

## PHASE 10: VERIFY API ENDPOINTS 📡

### 10.1: Open Browser Developer Tools
- [ ] Press **F12** to open DevTools
- [ ] Go to **Network** tab
- [ ] Reload page (F5)

### 10.2: Check API Calls
- [ ] Look for requests starting with `api/`
- [ ] Each should show status: **200 OK** (green)
- [ ] Should see requests to:
  - [ ] `/api/getDashboardStats`
  - [ ] `/api/getAllVehicles`
  - [ ] `/api/getAlerts`
  - [ ] `/api/getTheftEvents`
  - [ ] `/api/getVehicleFuelStatus`

### 10.3: Check Console for Errors
- [ ] Go to **Console** tab
- [ ] Should be empty (no red error messages)
- [ ] Yellow warnings are OK

---

## PHASE 11: DOCUMENTATION REVIEW 📚

### 11.1: Read Quick Documentation
- [ ] `QUICK_START_NODEJS.md` - Overview of system (5 min read)
- [ ] `NODEJS_API_REFERENCE.md` - All 12 API endpoints (10 min read)
- [ ] `NODEJS_DEPLOYMENT_CHECKLIST.md` - Deployment verification (10 min read)

### 11.2: Understand Architecture
- [ ] Backend: Node.js Express server (`backend/server.js`)
- [ ] Frontend: React app (`frontend/app.jsx`)
- [ ] Database: MySQL with triggers (`database/setup.sql`)
- [ ] Configuration: `.env` file

---

## PHASE 12: FINAL VERIFICATION ✅

### System Status Check

- [ ] **Server Running**: Terminal shows "Server running on http://localhost:3000"
- [ ] **Database Connected**: Terminal shows "Connected to MySQL database"
- [ ] **Frontend Loads**: Browser shows application at http://localhost:3000/index.html
- [ ] **Data Displays**: 3 vehicles visible
- [ ] **Theft Detection Works**: Fuel update triggers lock and alert
- [ ] **API Calls Successful**: Network tab shows 200 OK responses
- [ ] **No Console Errors**: DevTools console is empty

### All Checks Passed?

- [ ] **YES** → System is fully operational! ✅
- [ ] **NO** → See troubleshooting section below

---

## 🔧 TROUBLESHOOTING

### Problem: "npm: command not found"
**Solution**:
```powershell
# Restart PowerShell completely
# Close and reopen PowerShell
# Try again: npm --version
```

### Problem: "Cannot find module 'express'"
**Solution**:
```powershell
cd D:\DBMSCA3
npm install
```

### Problem: "ECONNREFUSED 127.0.0.1:3306"
**Solution**:
1. [ ] Verify MySQL is running (check Services or XAMPP)
2. [ ] Check `.env` credentials: `cat .env`
3. [ ] Test MySQL connection:
   ```powershell
   mysql -u root -p
   ```
4. [ ] Restart Node server after fixing

### Problem: "Port 3000 already in use"
**Solution**:
1. [ ] Edit `.env`: Change `PORT=3000` to `PORT=8080`
2. [ ] Restart server: `npm start`
3. [ ] Access: `http://localhost:8080/index.html`

### Problem: "Database 'smart_fuel_theft' does not exist"
**Solution**:
```powershell
mysql -u root -p < D:\DBMSCA3\database\setup.sql
```

### Problem: "Page loads but no data showing"
**Solution**:
1. [ ] Open DevTools (F12)
2. [ ] Check Console tab for red errors
3. [ ] Check Network tab - do API calls show 200 OK?
4. [ ] If API errors, check MySQL running:
   ```powershell
   mysql -u root -p -e "SELECT COUNT(*) FROM smart_fuel_theft.vehicles;"
   ```

### Problem: "Fuel update doesn't trigger lock"
**Solution**:
1. [ ] Verify large fuel decrease (e.g., 5 → 2 = > 25%)
2. [ ] Check database trigger exists:
   ```powershell
   mysql -u root -p -e "SHOW TRIGGERS FROM smart_fuel_theft;"
   ```
3. [ ] Check theft events table:
   ```powershell
   mysql -u root -p -e "SELECT * FROM smart_fuel_theft.FuelTheftEvents;"
   ```

---

## 🎯 SUCCESS CRITERIA

Your system is **ready for production** when:

- [x] Node.js installed and verified
- [x] MySQL installed and verified
- [x] `npm install` completed without errors
- [x] Database setup completed
- [x] Server starts with `npm start`
- [x] Application loads in browser
- [x] 3 vehicles visible on dashboard
- [x] Fuel update triggers theft detection (vehicle locks, alert appears)
- [x] No errors in browser console
- [x] No errors in server terminal
- [x] All API calls return 200 OK

---

## 📞 QUICK REFERENCE

### Commands to Remember
```powershell
# Install dependencies (run once)
npm install

# Setup database (run once)
mysql -u root -p < D:\DBMSCA3\database\setup.sql

# Start production server
npm start

# Start development server (auto-reload)
npm run dev

# Test database
mysql -u root -p -e "SELECT COUNT(*) FROM smart_fuel_theft.vehicles;"
```

### URLs to Remember
```
Application:  http://localhost:3000/index.html
API Base:     http://localhost:3000/api
Dashboard:    http://localhost:3000/index.html#dashboard
```

### Files to Remember
```
Server:       D:\DBMSCA3\backend\server.js
Frontend:     D:\DBMSCA3\frontend\app.jsx
Database:     D:\DBMSCA3\database\setup.sql
Config:       D:\DBMSCA3\.env
Dependencies: D:\DBMSCA3\package.json
```

---

## 🎉 COMPLETION

When you've completed all phases and all checks pass:

**Congratulations! Your Smart Vehicle Fuel Theft Detection System is fully operational!**

You now have:
- ✅ A working smart vehicle tracking system
- ✅ Automatic theft detection with database triggers
- ✅ Real-time alerts and notifications
- ✅ Vehicle lock/unlock control
- ✅ Complete audit trail of fuel consumption
- ✅ Modern Node.js + React + MySQL stack

**Next Steps**:
- Test all features thoroughly
- Add more vehicles
- Monitor theft detection
- Review the code to understand how it works
- Consider deploying to a production server

---

**Checklist Status**: Ready to begin! Follow each phase in order. ✅

**Need Help?** Check the documentation files or review the troubleshooting section above.
