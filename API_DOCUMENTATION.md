# Smart Vehicle Fuel Theft Detection System - API Documentation

## API Base URL
```
http://localhost/api.php
```

## Response Format
All API responses follow this JSON structure:

### Success Response
```json
{
    "status": "success",
    "message": "Operation successful",
    "data": {
        // Response data here
    }
}
```

### Error Response
```json
{
    "status": "error",
    "message": "Error description",
    "data": null
}
```

---

## 🚗 Vehicle Management Endpoints

### 1. Get All Vehicles
**Endpoint**: `GET api.php?action=getAllVehicles`

**Description**: Retrieve all registered vehicles with their current fuel status

**Parameters**: None

**Response**:
```json
{
    "status": "success",
    "message": "Vehicles fetched successfully",
    "data": [
        {
            "vehicle_id": 1,
            "owner_name": "Amarjeet Yadav",
            "reg_number": "PB10AB1234",
            "model": "Suzuki Access",
            "fuel_capacity": 6,
            "last_fuel_level": 5,
            "is_locked": false
        },
        ...
    ]
}
```

**Example**:
```bash
curl "http://localhost/api.php?action=getAllVehicles"
```

---

### 2. Get Single Vehicle
**Endpoint**: `GET api.php?action=getVehicle&vehicle_id={id}`

**Description**: Get detailed information for a specific vehicle

**Parameters**:
- `vehicle_id` (required): Vehicle ID

**Response**:
```json
{
    "status": "success",
    "message": "Vehicle fetched successfully",
    "data": {
        "vehicle_id": 1,
        "owner_name": "Amarjeet Yadav",
        "reg_number": "PB10AB1234",
        "model": "Suzuki Access",
        "fuel_capacity": 6,
        "last_fuel_level": 5,
        "is_locked": false,
        "lock_reason": null
    }
}
```

**Example**:
```bash
curl "http://localhost/api.php?action=getVehicle&vehicle_id=1"
```

---

### 3. Add New Vehicle
**Endpoint**: `POST api.php?action=addVehicle`

**Description**: Register a new vehicle in the system

**Request Body** (JSON):
```json
{
    "owner_name": "John Doe",
    "reg_number": "ABC1234",
    "model": "Honda Activa",
    "fuel_capacity": 5
}
```

**Required Fields**:
- `owner_name` (string)
- `reg_number` (string) - Must be unique
- `fuel_capacity` (integer) - In liters

**Optional Fields**:
- `model` (string)

**Response**:
```json
{
    "status": "success",
    "message": "Vehicle added successfully",
    "data": {
        "vehicle_id": 4
    }
}
```

**Example**:
```bash
curl -X POST http://localhost/api.php?action=addVehicle \
  -H "Content-Type: application/json" \
  -d '{
    "owner_name": "John Doe",
    "reg_number": "ABC1234",
    "model": "Honda Activa",
    "fuel_capacity": 5
  }'
```

---

## ⛽ Fuel Level Management

### 4. Update Fuel Level
**Endpoint**: `POST api.php?action=updateFuelLevel`

**Description**: Update vehicle fuel level (simulates sensor reading). If sudden drop detected, triggers theft detection.

**Request Body** (JSON):
```json
{
    "vehicle_id": 1,
    "fuel_level": 3
}
```

**Required Fields**:
- `vehicle_id` (integer)
- `fuel_level` (integer) - New fuel level in liters

**Response**:
```json
{
    "status": "success",
    "message": "Fuel level updated successfully",
    "data": {}
}
```

**Automatic Trigger**:
- If new fuel level < previous level → Theft detected
- Vehicle auto-locks
- Alert generated
- Event logged in FuelTheftEvents

**Example** (Simulating theft):
```bash
# Current: 5L → New: 2L (sudden drop detected)
curl -X POST http://localhost/api.php?action=updateFuelLevel \
  -H "Content-Type: application/json" \
  -d '{
    "vehicle_id": 1,
    "fuel_level": 2
  }'
```

---

### 5. Get Fuel Logs
**Endpoint**: `GET api.php?action=getFuelLogs&vehicle_id={id}`

**Description**: Get fuel level history for a vehicle (last 50 entries)

**Parameters**:
- `vehicle_id` (required): Vehicle ID

**Response**:
```json
{
    "status": "success",
    "message": "Fuel logs fetched successfully",
    "data": [
        {
            "log_id": 1,
            "vehicle_id": 1,
            "fuel_level": 5,
            "recorded_at": "2024-11-27 10:30:45"
        },
        {
            "log_id": 2,
            "vehicle_id": 1,
            "fuel_level": 2,
            "recorded_at": "2024-11-27 10:35:20"
        },
        ...
    ]
}
```

**Example**:
```bash
curl "http://localhost/api.php?action=getFuelLogs&vehicle_id=1"
```

---

## 🚨 Alerts & Events

### 6. Get Alerts
**Endpoint**: `GET api.php?action=getAlerts` or `GET api.php?action=getAlerts&vehicle_id={id}`

**Description**: Get system alerts (optionally filtered by vehicle)

**Parameters**:
- `vehicle_id` (optional): Filter by vehicle ID

**Response**:
```json
{
    "status": "success",
    "message": "Alerts fetched successfully",
    "data": [
        {
            "alert_id": 1,
            "vehicle_id": 1,
            "alert_message": "🚨 ALERT: Fuel theft detected! Loss: 3 liters. Previous: 5L → Current: 2L",
            "is_read": false,
            "alert_time": "2024-11-27 10:35:20"
        },
        ...
    ]
}
```

**Example**:
```bash
# Get all alerts
curl "http://localhost/api.php?action=getAlerts"

# Get alerts for specific vehicle
curl "http://localhost/api.php?action=getAlerts&vehicle_id=1"
```

---

### 7. Get Theft Events
**Endpoint**: `GET api.php?action=getTheftEvents` or `GET api.php?action=getTheftEvents&vehicle_id={id}`

**Description**: Get recorded fuel theft incidents

**Parameters**:
- `vehicle_id` (optional): Filter by vehicle ID

**Response**:
```json
{
    "status": "success",
    "message": "Theft events fetched successfully",
    "data": [
        {
            "event_id": 1,
            "vehicle_id": 1,
            "owner_name": "Amarjeet Yadav",
            "reg_number": "PB10AB1234",
            "previous_level": 5,
            "current_level": 2,
            "fuel_loss": 3,
            "theft_detected_at": "2024-11-27 10:35:20"
        },
        ...
    ]
}
```

**Example**:
```bash
# Get all theft events
curl "http://localhost/api.php?action=getTheftEvents"

# Get theft events for specific vehicle
curl "http://localhost/api.php?action=getTheftEvents&vehicle_id=1"
```

---

### 8. Get Theft History
**Endpoint**: `GET api.php?action=getTheftHistory&vehicle_id={id}`

**Description**: Get complete theft history for a specific vehicle

**Parameters**:
- `vehicle_id` (required): Vehicle ID

**Response**: Same as Theft Events endpoint for specific vehicle

**Example**:
```bash
curl "http://localhost/api.php?action=getTheftHistory&vehicle_id=1"
```

---

## 🔒 Vehicle Lock Management

### 9. Lock Vehicle
**Endpoint**: `POST api.php?action=lockVehicle`

**Description**: Manually lock a vehicle (also used automatically on theft detection)

**Request Body** (JSON):
```json
{
    "vehicle_id": 1,
    "reason": "MANUAL_LOCK"
}
```

**Required Fields**:
- `vehicle_id` (integer)

**Optional Fields**:
- `reason` (string): Lock reason (default: "MANUAL_LOCK")
- Possible values: "MANUAL_LOCK", "FUEL_THEFT_DETECTED", "MAINTENANCE", etc.

**Response**:
```json
{
    "status": "success",
    "message": "Vehicle locked successfully",
    "data": {}
}
```

**Example**:
```bash
curl -X POST http://localhost/api.php?action=lockVehicle \
  -H "Content-Type: application/json" \
  -d '{
    "vehicle_id": 1,
    "reason": "MANUAL_LOCK"
  }'
```

---

### 10. Unlock Vehicle
**Endpoint**: `POST api.php?action=unlockVehicle`

**Description**: Unlock a vehicle

**Request Body** (JSON):
```json
{
    "vehicle_id": 1
}
```

**Required Fields**:
- `vehicle_id` (integer)

**Response**:
```json
{
    "status": "success",
    "message": "Vehicle unlocked successfully",
    "data": {}
}
```

**Example**:
```bash
curl -X POST http://localhost/api.php?action=unlockVehicle \
  -H "Content-Type: application/json" \
  -d '{
    "vehicle_id": 1
  }'
```

---

## 📊 Dashboard & Statistics

### 11. Get Dashboard Statistics
**Endpoint**: `GET api.php?action=getDashboardStats`

**Description**: Get overview statistics for dashboard

**Parameters**: None

**Response**:
```json
{
    "status": "success",
    "message": "Dashboard statistics fetched successfully",
    "data": {
        "total_vehicles": 3,
        "locked_vehicles": 1,
        "total_theft_events": 2,
        "recent_alerts": 5,
        "total_fuel_loss": 8
    }
}
```

**Metrics Included**:
- `total_vehicles`: All registered vehicles
- `locked_vehicles`: Vehicles currently locked
- `total_theft_events`: Total thefts ever detected
- `recent_alerts`: Alerts from last 24 hours
- `total_fuel_loss`: Total fuel lost to theft (liters)

**Example**:
```bash
curl "http://localhost/api.php?action=getDashboardStats"
```

---

### 12. Get Vehicle Fuel Status
**Endpoint**: `GET api.php?action=getVehicleFuelStatus`

**Description**: Get current fuel status for all vehicles with analytics

**Parameters**: None

**Response**:
```json
{
    "status": "success",
    "message": "Vehicle fuel status fetched successfully",
    "data": [
        {
            "vehicle_id": 1,
            "owner_name": "Amarjeet Yadav",
            "reg_number": "PB10AB1234",
            "model": "Suzuki Access",
            "fuel_capacity": 6,
            "last_fuel_level": 2,
            "fuel_percentage": 33.33,
            "is_locked": true,
            "theft_count": 1
        },
        ...
    ]
}
```

**Example**:
```bash
curl "http://localhost/api.php?action=getVehicleFuelStatus"
```

---

## 🧪 Testing with cURL

### Test Theft Detection
```bash
# 1. Get current fuel level
curl "http://localhost/api.php?action=getVehicle&vehicle_id=1"

# 2. Update to lower level (triggers theft detection)
curl -X POST http://localhost/api.php?action=updateFuelLevel \
  -H "Content-Type: application/json" \
  -d '{"vehicle_id": 1, "fuel_level": 1}'

# 3. Check alerts
curl "http://localhost/api.php?action=getAlerts&vehicle_id=1"

# 4. Check lock status
curl "http://localhost/api.php?action=getVehicle&vehicle_id=1"

# 5. Check theft events
curl "http://localhost/api.php?action=getTheftEvents&vehicle_id=1"
```

---

## Error Codes & Messages

| Status | Message | Meaning |
|--------|---------|---------|
| 400 | Invalid action | Unknown action parameter |
| 404 | Vehicle not found | Vehicle ID doesn't exist |
| 400 | Required fields missing | Missing required parameters |
| 500 | Connection failed | Database connection error |
| 200 | Success | Operation completed successfully |

---

## Rate Limiting Notes
- No rate limiting implemented (suitable for local/internal use)
- For production, implement rate limiting on API endpoints
- Consider adding API key authentication

---

## CORS Support
- All endpoints support CORS
- Requests from any origin are allowed
- Suitable for cross-domain API calls

---

## Performance Tips
1. **Cache frequent requests** - Dashboard stats can be cached for 5 seconds
2. **Batch requests** - Combine multiple GET requests where possible
3. **Use vehicle_id filter** - Always filter alerts/events by vehicle when possible
4. **Pagination** - Add limit/offset for large datasets

---

## Security Considerations
✅ Input validation on backend
✅ Prepared statements for SQL injection prevention
✅ Auto-escaping in responses
⚠️ TODO: Add authentication layer
⚠️ TODO: Add rate limiting
⚠️ TODO: Add HTTPS requirement

---

**API Version**: 1.0
**Last Updated**: November 2025
