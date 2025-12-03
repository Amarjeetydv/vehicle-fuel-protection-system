# Smart Vehicle Fuel Theft Detection System - Backend Features Guide

## ✅ All Backend Features Now Working in Demo Mode

The backend system is fully functional with graceful fallback to mock data when the MySQL database is not available. All features work seamlessly whether using real database or demo mode.

---

## 🔐 Lock/Unlock Features

### Lock Vehicle
**Endpoint:** `POST /api/lockVehicle`

**Request:**
```json
{
  "vehicle_id": 1,
  "reason": "MANUAL_LOCK"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Vehicle locked successfully (demo mode)",
  "data": null
}
```

**What it does:**
- Locks a vehicle in the system
- Records the lock reason
- Creates an automatic alert for the lock action
- Updates the dashboard statistics
- Works with both database and mock data

### Unlock Vehicle
**Endpoint:** `POST /api/unlockVehicle`

**Request:**
```json
{
  "vehicle_id": 1
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Vehicle unlocked successfully (demo mode)",
  "data": null
}
```

**What it does:**
- Unlocks a vehicle in the system
- Clears the lock reason
- Creates an automatic alert for the unlock action
- Updates the dashboard statistics
- Works with both database and mock data

---

## 🚗 Vehicle Management Features

### Get All Vehicles
**Endpoint:** `GET /api/getAllVehicles`

**Response:**
```json
{
  "status": "success",
  "message": "Vehicles fetched successfully (demo mode)",
  "data": [
    {
      "vehicle_id": 1,
      "owner_name": "John Doe",
      "reg_number": "ABC-1234",
      "model": "Toyota Camry",
      "fuel_capacity": 60,
      "last_fuel_level": 45,
      "is_locked": 0,
      "lock_reason": null,
      "lock_time": null
    }
  ]
}
```

### Get Vehicle Fuel Status
**Endpoint:** `GET /api/getVehicleFuelStatus`

**Response:**
```json
{
  "status": "success",
  "message": "Vehicle fuel status fetched successfully (demo mode)",
  "data": [
    {
      "vehicle_id": 1,
      "owner_name": "John Doe",
      "reg_number": "ABC-1234",
      "model": "Toyota Camry",
      "fuel_capacity": 60,
      "last_fuel_level": 45,
      "fuel_percentage": 75.00,
      "is_locked": 0,
      "lock_reason": null,
      "theft_count": 0
    }
  ]
}
```

### Add New Vehicle
**Endpoint:** `POST /api/addVehicle`

**Request:**
```json
{
  "owner_name": "Mike Wilson",
  "reg_number": "GHI-3456",
  "model": "Nissan Altima",
  "fuel_capacity": 50
}
```

### Get Single Vehicle
**Endpoint:** `GET /api/getVehicle/:vehicle_id`

---

## ⛽ Fuel Management Features

### Update Fuel Level
**Endpoint:** `POST /api/updateFuelLevel`

**Request:**
```json
{
  "vehicle_id": 1,
  "fuel_level": 40
}
```

**What it does:**
- Updates the current fuel level for a vehicle
- Logs the update in the FuelLogs table
- Triggers automatic theft detection logic (in database mode)

### Get Fuel Logs
**Endpoint:** `GET /api/getFuelLogs/:vehicle_id`

---

## 🚨 Alerts & Theft Detection Features

### Get Alerts
**Endpoint:** `GET /api/getAlerts` or `GET /api/getAlerts?vehicle_id=1`

**Response:**
```json
{
  "status": "success",
  "message": "Alerts fetched successfully (demo mode)",
  "data": [
    {
      "alert_id": 1,
      "vehicle_id": 1,
      "alert_message": "Suspicious fuel decrease detected on ABC-1234 (John Doe)",
      "alert_time": "2025-11-27T14:30:00.000Z",
      "status": "ACTIVE"
    }
  ]
}
```

### Get Theft Events
**Endpoint:** `GET /api/getTheftEvents` or `GET /api/getTheftEvents?vehicle_id=1`

**Response:**
```json
{
  "status": "success",
  "message": "Theft events fetched successfully (demo mode)",
  "data": [
    {
      "event_id": 1,
      "vehicle_id": 1,
      "reg_number": "ABC-1234",
      "owner_name": "John Doe",
      "previous_level": 48,
      "current_level": 45,
      "fuel_loss": 3,
      "status": "DETECTED",
      "theft_detected_at": "2025-11-27T14:30:00.000Z"
    }
  ]
}
```

### Get Theft History
**Endpoint:** `GET /api/getTheftHistory/:vehicle_id`

---

## 📊 Dashboard & Statistics Features

### Get Dashboard Statistics
**Endpoint:** `GET /api/getDashboardStats`

**Response:**
```json
{
  "status": "success",
  "message": "Dashboard statistics fetched successfully (demo mode)",
  "data": {
    "total_vehicles": 3,
    "locked_vehicles": 0,
    "total_theft_events": 1,
    "recent_alerts": 1,
    "total_fuel_loss": 3
  }
}
```

**Features:**
- Total number of vehicles in the system
- Number of currently locked vehicles
- Total theft events detected
- Recent alerts in the last 24 hours
- Total fuel loss from theft events

---

## 🎯 Frontend Features Using Backend

The React frontend (`app.jsx`) uses all these backend endpoints:

### Dashboard Tab
- Displays key statistics (locked vehicles, alerts, theft events)
- Shows vehicle fuel status with live progress bars
- Shows recent alerts
- Shows fuel theft events

### Vehicles Tab
- Lists all vehicles with owner name, registration, model
- Shows current fuel level and percentage
- **Lock/Unlock buttons** - Click to lock or unlock any vehicle
- Add new vehicle button
- Update fuel level button

### Alerts Tab
- View all system alerts
- Alerts generated from lock/unlock actions
- Alerts generated from suspicious fuel decreases
- Shows alert message, vehicle info, and timestamp

### Theft Events Tab
- View all fuel theft events
- Shows previous fuel level, current level, and fuel loss amount
- Displays when theft was detected

---

## 🔄 Demo Mode vs Database Mode

### Demo Mode (Current)
- ✅ All 12 endpoints work fully
- ✅ Mock data persists during the session
- ✅ Lock/unlock changes are reflected in memory
- ✅ Alerts are generated and stored
- ⚠️ Data resets when server restarts

### Database Mode (When MySQL is connected)
- ✅ All endpoints work with persistent MySQL database
- ✅ Automatic theft detection triggers
- ✅ Data survives server restarts
- ✅ Can handle high volume of vehicles and events

---

## 📋 Testing Lock/Unlock Features in Browser

1. **Open the application:** http://localhost:3000/index.html
2. **Navigate to Vehicles tab**
3. **Find any vehicle card**
4. **Look for lock/unlock button:**
   - If vehicle is unlocked: Shows "🔒 Lock Vehicle" (Red button)
   - If vehicle is locked: Shows "🔓 Unlock Vehicle" (Green button)
5. **Click to lock/unlock** - The button will immediately update
6. **Check the Alerts tab** - You'll see a new alert about the lock/unlock action
7. **Check Dashboard** - The "Locked Vehicles" count will update

---

## 🛠️ All 12 API Endpoints Summary

| # | Method | Endpoint | Purpose |
|---|--------|----------|---------|
| 1 | GET | `/api/getAllVehicles` | Fetch all vehicles |
| 2 | GET | `/api/getVehicle/:id` | Fetch specific vehicle |
| 3 | POST | `/api/addVehicle` | Add new vehicle |
| 4 | POST | `/api/updateFuelLevel` | Update fuel level |
| 5 | GET | `/api/getFuelLogs/:id` | Get fuel logs |
| 6 | GET | `/api/getAlerts` | Get all alerts |
| 7 | GET | `/api/getTheftEvents` | Get theft events |
| 8 | GET | `/api/getTheftHistory/:id` | Get vehicle theft history |
| 9 | POST | `/api/lockVehicle` | **Lock a vehicle** |
| 10 | POST | `/api/unlockVehicle` | **Unlock a vehicle** |
| 11 | GET | `/api/getDashboardStats` | Get dashboard statistics |
| 12 | GET | `/api/getVehicleFuelStatus` | Get vehicle fuel status |

---

## 📝 Notes

- All endpoints return JSON with consistent format: `{ status, message, data }`
- Error handling is built-in with fallback to mock data
- Server URL: `http://localhost:3000`
- Database connection is attempted first; if it fails, mock data is used
- Mock data is stored in memory and can be modified through API calls
- To use real MySQL database, update `.env` file with correct credentials

