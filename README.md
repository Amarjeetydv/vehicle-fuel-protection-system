# Smart Vehicle Fuel Theft Detection & Lock Mechanism
## Complete Implementation Guide

### 📋 Project Overview
This is a comprehensive single-page web application for monitoring vehicle fuel levels, detecting theft in real-time, and automatically locking vehicles when suspicious activity is detected.

**Technology Stack:**
- Frontend: HTML, Bootstrap 5, React 18, JSX
- Backend: PHP 7+
- Database: MySQL 5.7+
- Real-time Monitoring: AJAX/Fetch API with 5-second refresh

---

## 🏗️ Project Structure

```
DBMSCA3/
├── index.html              # Main HTML entry point
├── frontend/
│   └── app.jsx            # React component (single-page app)
├── backend/
│   ├── config.php         # Database configuration
│   └── api.php            # PHP API endpoints
└── database/
    └── setup.sql          # Complete database setup script
```

---

## 🚀 Installation & Setup

### Step 1: Database Setup
1. Open MySQL Command Line or MySQL Workbench
2. Run the SQL script: `database/setup.sql`
3. This will:
   - Create the database `smart_fuel_theft`
   - Create all 6 tables
   - Insert sample data (3 vehicles)
   - Create the main trigger for theft detection
   - Create views, stored procedures, and functions

### Step 2: Backend Setup
1. Copy `backend/` folder to your web server root (e.g., `C:\xampp\htdocs\`)
2. Edit `backend/config.php` to match your database credentials:
   ```php
   define('DB_HOST', 'localhost');
   define('DB_USER', 'root');
   define('DB_PASS', '');
   define('DB_NAME', 'smart_fuel_theft');
   ```
3. Ensure PHP is enabled with MySQLi extension

### Step 3: Frontend Setup
1. Place `index.html` and `frontend/` folder in your web server root
2. Update API endpoint in `frontend/app.jsx` if needed (default: `http://localhost/api.php`)
3. Open `index.html` in your browser

### Step 4: Testing
1. Access the application: `http://localhost/index.html`
2. You should see the dashboard with 3 sample vehicles

---

## 🎯 Key Features

### 1. **Dashboard**
- Real-time statistics (Total vehicles, Locked vehicles, Theft events, Total fuel loss)
- Vehicle fuel status with progress bars
- Recent alerts display
- Auto-refreshes every 5 seconds

### 2. **Vehicle Management**
- View all registered vehicles
- Add new vehicles
- Update fuel levels (simulates sensor readings)
- Lock/Unlock vehicles manually
- View vehicle details and history

### 3. **Fuel Theft Detection (Automatic)**
- **Trigger-based Detection**: When fuel level drops suddenly
- **Auto-lock Mechanism**: Vehicle locks automatically when theft detected
- **Alert Generation**: Instant alerts sent to dashboard
- **Event Logging**: All theft events are recorded with timestamps

### 4. **Alerts & Monitoring**
- Real-time fuel theft alerts
- Low fuel warnings
- Lock status updates
- Alert history with timestamps

### 5. **Reports**
- Theft history per vehicle
- Fuel loss analytics
- Lock status tracking
- Complete audit logs

---

## 🛢️ Database Schema

### Tables
| Table | Purpose |
|-------|---------|
| **Vehicles** | Store vehicle information |
| **FuelSensor** | Current fuel level readings |
| **FuelTheftEvents** | Recorded theft incidents |
| **Alerts** | System and theft alerts |
| **FuelLogs** | Historical fuel level logs |
| **VehicleLockStatus** | Vehicle lock status tracking |

### Key Components
- **Triggers**: `detect_fuel_theft` - Automatically detects and responds to theft
- **Views**: `VehicleFuelStatus`, `TheftSummary`, `VehicleLockStatusView`
- **Stored Procedures**: `GetFuelLogs()`, `GetTheftHistory()`, `LockVehicle()`, `UnlockVehicle()`, `LowFuelCheck()`
- **Functions**: `FuelPercentage()`, `GetTheftCount()`, `GetTotalFuelLoss()`

---

## 📡 API Endpoints

All endpoints use PHP at `backend/api.php`

### GET Requests
- `?action=getAllVehicles` - Get all vehicles
- `?action=getVehicle&vehicle_id=1` - Get specific vehicle
- `?action=getAlerts&vehicle_id=1` - Get alerts for vehicle
- `?action=getTheftEvents&vehicle_id=1` - Get theft events
- `?action=getFuelLogs&vehicle_id=1` - Get fuel logs
- `?action=getTheftHistory&vehicle_id=1` - Get theft history
- `?action=getDashboardStats` - Get dashboard statistics
- `?action=getVehicleFuelStatus` - Get fuel status for all vehicles

### POST Requests
- `?action=addVehicle` - Add new vehicle
- `?action=updateFuelLevel` - Update fuel level
- `?action=lockVehicle` - Lock vehicle
- `?action=unlockVehicle` - Unlock vehicle

---

## 🧪 Testing the Theft Detection System

### Simulate Fuel Theft
1. Go to **Vehicles** tab
2. Click "Update Fuel" on any vehicle
3. Reduce fuel level significantly (e.g., from 5L to 2L)
4. Click "Update Fuel"
5. **Expected Result**:
   - Alert appears in the system
   - Vehicle status changes to 🔒 LOCKED
   - Theft event is recorded
   - Dashboard stats update

### Example Trigger Test (MySQL)
```sql
-- Check current fuel level
SELECT * FROM FuelSensor WHERE vehicle_id = 1;

-- Simulate theft: 5 liters → 2 liters
UPDATE FuelSensor SET last_fuel_level = 2 WHERE sensor_id = 1;

-- Check what was recorded
SELECT * FROM FuelTheftEvents;
SELECT * FROM Alerts WHERE vehicle_id = 1;
SELECT * FROM VehicleLockStatus WHERE vehicle_id = 1;
```

---

## 🎨 UI Features

### Responsive Design
- Mobile-friendly Bootstrap 5 layout
- Adaptive grid system
- Touch-friendly buttons

### Modern Styling
- Gradient backgrounds
- Card-based layout
- Smooth animations and transitions
- Color-coded status indicators
- Progress bars for fuel levels

### Navigation
- Tab-based navigation for easy access
- Dashboard, Vehicles, Alerts, and Theft Events sections
- Quick action buttons on each vehicle card

---

## 🔐 Security Features

1. **Auto-lock on Theft Detection**: Vehicle automatically locks when suspicious activity detected
2. **Manual Lock Override**: Admin can manually lock/unlock vehicles
3. **Audit Trail**: All events are logged with timestamps
4. **Real-time Alerts**: Instant notifications of suspicious activity
5. **Data Validation**: PHP backend validates all inputs

---

## 📊 Sample Data

### Pre-loaded Vehicles:
1. **Amarjeet Yadav** - Suzuki Access (6L capacity) - Reg: PB10AB1234
2. **Rahul Kumar** - Activa 6G (5L capacity) - Reg: PB07XY9876
3. **Priya Sharma** - Pulsar 150 (12L capacity) - Reg: PB09CD4590

---

## 🐛 Troubleshooting

### Issue: "Connection failed" error
- **Solution**: Check database credentials in `backend/config.php`
- Ensure MySQL service is running
- Verify database name is `smart_fuel_theft`

### Issue: API returns empty data
- **Solution**: Run `database/setup.sql` first
- Check that PHP's MySQLi extension is enabled
- Verify API endpoint URL in `frontend/app.jsx`

### Issue: Theft detection not working
- **Solution**: Verify trigger is created: `SHOW TRIGGERS;`
- Check fuel level update syntax in updateFuelLevel function
- Ensure FuelSensor table has proper foreign key constraints

### Issue: Lock status not updating
- **Solution**: Check stored procedure `LockVehicle` exists
- Verify VehicleLockStatus table has correct vehicle_id

---

## 🔄 Real-time Updates

The dashboard automatically refreshes every 5 seconds with:
- Latest vehicle fuel levels
- Current lock statuses
- Recent alerts
- Updated statistics

---

## 📝 License & Usage

This is an educational project demonstrating:
- Database design and optimization
- Complex SQL queries with triggers and procedures
- PHP backend development
- React frontend with API integration
- Real-time data monitoring system

---

## 👨‍💻 Developer Notes

### For Adding New Features:
1. Add API endpoint to `backend/api.php`
2. Add React state and methods to `frontend/app.jsx`
3. Add corresponding UI elements

### For Database Modifications:
1. Update table schema in `database/setup.sql`
2. Recreate views and procedures
3. Test trigger behavior with sample updates

### For Performance Optimization:
- Indexes are already created on vehicle_id and timestamps
- Implement pagination for large datasets
- Use database connection pooling
- Cache frequently accessed data

---

## 📞 Support

For issues or questions:
1. Check the Troubleshooting section
2. Review database setup.sql for schema details
3. Test API endpoints with Postman or similar tools
4. Check browser console for JavaScript errors

---

**Last Updated**: November 2025
**System Version**: 1.0
**Status**: Production Ready
