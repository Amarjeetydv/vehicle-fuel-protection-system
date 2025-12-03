# Quick Start Guide - Smart Vehicle Fuel Theft Detection System

## ⚡ 5-Minute Quick Start

### Prerequisites
- XAMPP, WAMP, or any local PHP + MySQL server
- Modern web browser (Chrome, Firefox, Edge)
- MySQL command line or GUI (optional, for manual testing)

### Installation

#### 1. Database Setup (2 minutes)
```bash
# Option A: Using MySQL Command Line
mysql -u root -p < database/setup.sql

# Option B: Using MySQL GUI
# 1. Open MySQL Workbench
# 2. Create new connection
# 3. Open database/setup.sql file
# 4. Execute all commands
```

#### 2. Copy Files to Server (1 minute)
```bash
# Copy entire DBMSCA3 folder to:
# C:\xampp\htdocs\              (Windows - XAMPP)
# /var/www/html/                (Linux)
# /Library/WebServer/Documents/ (Mac)
```

#### 3. Open Application (1 minute)
```
Browser URL: http://localhost/DBMSCA3/index.html
```

#### 4. Test the System (1 minute)
- Dashboard loads with 3 sample vehicles
- Go to "Vehicles" tab
- Click "Update Fuel" on any vehicle
- Reduce fuel level significantly
- Watch vehicle auto-lock when theft is detected!

---

## 🎮 User Guide

### Dashboard Tab
- View overall system statistics
- Monitor all vehicle fuel levels
- Check recent alerts
- Real-time status updates

### Vehicles Tab
- View all registered vehicles
- Add new vehicle (click ➕ Add New Vehicle)
- Update fuel levels (simulates sensor readings)
- Lock/Unlock vehicles
- Quick status cards for each vehicle

### Alerts Tab
- View all system alerts
- See fuel theft alerts
- Check lock status changes
- Timestamp for each alert

### Theft Events Tab
- View all recorded theft incidents
- See fuel loss amounts
- Track theft patterns
- View detection timestamps

---

## 🧪 Demo Scenarios

### Scenario 1: Detect Fuel Theft
1. Go to **Vehicles** tab
2. Find "Amarjeet Yadav" (Suzuki Access, 6L)
3. Click **Update Fuel** button
4. Change fuel level from 5L to 2L
5. Click **Update Fuel**
6. ✅ Watch vehicle auto-lock!
7. Go to **Dashboard** - theft event recorded

### Scenario 2: Add New Vehicle
1. Click **Add New Vehicle** button
2. Fill form:
   - Owner Name: Your Name
   - Registration: ABC1234
   - Model: Your Car Model
   - Capacity: 50 (or your vehicle capacity)
3. Click **Add Vehicle**
4. New vehicle appears in list

### Scenario 3: Manual Lock/Unlock
1. Click **Lock Vehicle** on any vehicle
2. Vehicle shows 🔒 LOCKED status
3. Alert generated automatically
4. Click **Unlock Vehicle** to unlock
5. Status changes to 🔓 OPEN

---

## 📋 Features Breakdown

| Feature | Status | Purpose |
|---------|--------|---------|
| Real-time Fuel Monitoring | ✅ | Track fuel levels 24/7 |
| Automatic Theft Detection | ✅ | Detect sudden fuel loss |
| Auto-lock Mechanism | ✅ | Lock vehicle on theft |
| Alert System | ✅ | Notify owner instantly |
| Audit Logs | ✅ | Track all events |
| Manual Control | ✅ | Override locks if needed |
| Fuel Loss Analytics | ✅ | View theft statistics |
| Mobile Responsive | ✅ | Works on all devices |

---

## 🔧 Configuration

### Change Database Credentials
Edit: `backend/config.php`
```php
define('DB_HOST', 'localhost');      // Your MySQL host
define('DB_USER', 'root');           // Your MySQL user
define('DB_PASS', '');               // Your MySQL password
define('DB_NAME', 'smart_fuel_theft'); // Database name
```

### Change API Endpoint
Edit: `frontend/app.jsx` (Line ~20)
```javascript
this.apiBase = 'http://localhost/api.php'; // Your API URL
```

---

## 🗂️ File Explanations

```
DBMSCA3/
├── index.html
│   └── Main page - loads Bootstrap, React, and your app
│
├── frontend/app.jsx
│   └── React component - entire UI and logic
│
├── backend/
│   ├── config.php - Database connection & response handlers
│   └── api.php - PHP backend - all API endpoints
│
├── database/setup.sql
│   └── Complete database schema, triggers, procedures
│
├── README.md
│   └── Full documentation
│
└── QUICKSTART.md
    └── This file
```

---

## 🐛 Common Issues & Fixes

### "Cannot connect to database"
✅ Check DB credentials in `backend/config.php`
✅ Ensure MySQL is running
✅ Check database name: should be `smart_fuel_theft`

### API returns 404 or blank
✅ Ensure files are in web server directory
✅ Check API URL in app.jsx
✅ Enable PHP with MySQLi extension

### Theft detection not working
✅ Run database/setup.sql completely
✅ Check trigger exists: `SHOW TRIGGERS;` in MySQL
✅ Try updating fuel level again

### Dashboard shows no vehicles
✅ Run `INSERT` commands from database/setup.sql
✅ Refresh page (F5)
✅ Check browser console for errors

---

## 📱 Testing on Different Devices

### Desktop Browser
- Works perfectly on all modern browsers
- Full functionality available

### Mobile/Tablet
- Responsive Bootstrap layout
- Touch-friendly buttons
- All features accessible

### Production Deployment
1. Set proper file permissions
2. Update API URLs to production domain
3. Use HTTPS instead of HTTP
4. Add proper security headers
5. Implement user authentication

---

## 🔐 Security Notes

⚠️ This system includes:
- Real-time theft detection
- Automatic vehicle locking
- Complete audit trails
- Input validation on backend

⚠️ For production use, add:
- User authentication
- HTTPS encryption
- Database backups
- Access control lists

---

## 📊 Database Structure at a Glance

```sql
-- Main tables
Vehicles          → Vehicle information
FuelSensor        → Current fuel levels
FuelTheftEvents   → Theft incidents
Alerts            → System alerts
FuelLogs          → Historical data
VehicleLockStatus → Lock status

-- Trigger (Automatic)
detect_fuel_theft → Fires on fuel level drop
                   Detects theft
                   Creates alerts
                   Locks vehicle

-- Functions (Calculations)
FuelPercentage()     → Calculate % remaining
GetTheftCount()      → Count thefts per vehicle
GetTotalFuelLoss()   → Sum total loss

-- Procedures (Operations)
GetFuelLogs()        → Get fuel history
LockVehicle()        → Lock vehicle
UnlockVehicle()      → Unlock vehicle
LowFuelCheck()       → Warn low fuel
```

---

## 🚀 Advanced Testing

### Test Theft Detection with SQL
```sql
-- Update fuel level (triggers theft detection automatically)
UPDATE FuelSensor SET last_fuel_level = 1 WHERE sensor_id = 2;

-- Check what happened
SELECT * FROM FuelTheftEvents;
SELECT * FROM Alerts;
SELECT * FROM VehicleLockStatus WHERE is_locked = TRUE;
```

### Test Low Fuel Alert
```sql
-- Call procedure to check and alert low fuel
CALL LowFuelCheck();

-- View alerts generated
SELECT * FROM Alerts ORDER BY alert_time DESC;
```

### View All System Data
```sql
-- Dashboard stats
SELECT COUNT(*) as total_vehicles FROM Vehicles;
SELECT COUNT(*) as locked_vehicles FROM VehicleLockStatus WHERE is_locked = TRUE;
SELECT COUNT(*) as total_thefts FROM FuelTheftEvents;
SELECT SUM(fuel_loss) as total_loss FROM FuelTheftEvents;
```

---

## 📞 Need Help?

1. **Check README.md** for detailed documentation
2. **Verify database setup** - most issues are DB-related
3. **Check browser console** - F12 → Console tab
4. **Verify file paths** - ensure all files are in correct location
5. **Test API directly** - open `api.php?action=getAllVehicles` in browser

---

## ✅ Verification Checklist

Before reporting issues, verify:
- [ ] Database setup.sql executed completely
- [ ] API endpoint URL is correct in app.jsx
- [ ] Database credentials are correct in config.php
- [ ] Web server is running (XAMPP, WAMP, etc.)
- [ ] Files are in web server root directory
- [ ] PHP MySQLi extension is enabled
- [ ] No errors in browser console (F12)
- [ ] MySQL service is running

---

**Version**: 1.0
**Last Updated**: November 2025
**Ready for**: Development & Testing

🎉 You're all set! Start monitoring fuel now!
