// Smart Vehicle Fuel Theft Detection System - Node.js Express Server
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../')));

// MySQL Connection Pool
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'smart_fuel_theft',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Mock Data for Demo - In-Memory Storage
let mockData = {
    vehicles: [
        { vehicle_id: 1, owner_name: 'John Doe', reg_number: 'ABC-1234', model: 'Toyota Camry', fuel_capacity: 60, last_fuel_level: 45, is_locked: 0, lock_reason: null, lock_time: null },
        { vehicle_id: 2, owner_name: 'Jane Smith', reg_number: 'XYZ-5678', model: 'Honda Civic', fuel_capacity: 60, last_fuel_level: 48, is_locked: 0, lock_reason: null, lock_time: null },
        { vehicle_id: 3, owner_name: 'Bob Johnson', reg_number: 'DEF-9012', model: 'Ford Focus', fuel_capacity: 60, last_fuel_level: 36, is_locked: 0, lock_reason: null, lock_time: null }
    ],
    alerts: [
        { 
            alert_id: 1, 
            vehicle_id: 1, 
            alert_message: 'Suspicious fuel decrease detected on ABC-1234 (John Doe)', 
            alert_time: new Date(Date.now() - 3600000).toISOString(),
            status: 'ACTIVE'
        }
    ],
    theftEvents: [
        { 
            event_id: 1, 
            vehicle_id: 1, 
            vehicle_name: 'ABC-1234', 
            owner_name: 'John Doe', 
            fuel_decrease: 3,
            previous_level: 48,
            current_level: 45,
            fuel_loss: 3,
            status: 'DETECTED', 
            theft_detected_at: new Date(Date.now() - 3600000).toISOString(),
            reg_number: 'ABC-1234'
        }
    ],
    stats: {
        total_vehicles: 3,
        locked_vehicles: 0,
        total_theft_events: 1,
        recent_alerts: 1,
        total_fuel_loss: 3
    }
};

// Response Helper
const sendResponse = (res, status, message, data = null) => {
    res.json({
        status: status,
        message: message,
        data: data
    });
};

// Error Handler
const handleError = (res, error, statusCode = 400) => {
    console.error(error);
    res.status(statusCode).json({
        status: 'error',
        message: error.message || 'Internal server error',
        data: null
    });
};

// =====================================================
// VEHICLE MANAGEMENT ENDPOINTS
// =====================================================

// Get all vehicles
app.get('/api/getAllVehicles', async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const [vehicles] = await connection.query(
            'SELECT v.*, fs.last_fuel_level, vls.is_locked, vls.lock_reason, vls.lock_time FROM Vehicles v LEFT JOIN FuelSensor fs ON v.vehicle_id = fs.vehicle_id LEFT JOIN VehicleLockStatus vls ON v.vehicle_id = vls.vehicle_id'
        );
        connection.release();
        sendResponse(res, 'success', 'Vehicles fetched successfully', vehicles);
    } catch (error) {
        console.log('Database error, using mock data');
        sendResponse(res, 'success', 'Vehicles fetched successfully (demo mode)', mockData.vehicles);
    }
});

// Get single vehicle
app.get('/api/getVehicle/:vehicle_id', async (req, res) => {
    try {
        const { vehicle_id } = req.params;
        const connection = await pool.getConnection();
        const [vehicles] = await connection.query(
            'SELECT v.*, fs.last_fuel_level, vls.is_locked, vls.lock_reason FROM Vehicles v LEFT JOIN FuelSensor fs ON v.vehicle_id = fs.vehicle_id LEFT JOIN VehicleLockStatus vls ON v.vehicle_id = vls.vehicle_id WHERE v.vehicle_id = ?',
            [vehicle_id]
        );
        connection.release();
        
        if (vehicles.length === 0) {
            return sendResponse(res, 'error', 'Vehicle not found', null);
        }
        
        sendResponse(res, 'success', 'Vehicle fetched successfully', vehicles[0]);
    } catch (error) {
        handleError(res, error);
    }
});

// Add new vehicle
app.post('/api/addVehicle', async (req, res) => {
    try {
        const { owner_name, reg_number, model, fuel_capacity } = req.body;
        
        if (!owner_name || !reg_number || !fuel_capacity) {
            return sendResponse(res, 'error', 'Required fields: owner_name, reg_number, fuel_capacity', null);
        }
        
        const connection = await pool.getConnection();
        
        // Insert vehicle
        const [result] = await connection.query(
            'INSERT INTO Vehicles(owner_name, reg_number, model, fuel_capacity) VALUES(?, ?, ?, ?)',
            [owner_name, reg_number, model || '', fuel_capacity]
        );
        
        const vehicle_id = result.insertId;
        
        // Insert sensor
        await connection.query(
            'INSERT INTO FuelSensor(vehicle_id, last_fuel_level) VALUES(?, ?)',
            [vehicle_id, fuel_capacity]
        );
        
        // Insert lock status
        await connection.query(
            'INSERT INTO VehicleLockStatus(vehicle_id, is_locked) VALUES(?, 0)',
            [vehicle_id]
        );
        
        connection.release();
        sendResponse(res, 'success', 'Vehicle added successfully', { vehicle_id });
    } catch (error) {
        handleError(res, error);
    }
});

// =====================================================
// FUEL MANAGEMENT ENDPOINTS
// =====================================================

// Update fuel level
app.post('/api/updateFuelLevel', async (req, res) => {
    try {
        const { vehicle_id, fuel_level } = req.body;
        
        if (!vehicle_id || fuel_level === undefined) {
            return sendResponse(res, 'error', 'Required fields: vehicle_id, fuel_level', null);
        }
        
        const connection = await pool.getConnection();
        
        // Get sensor_id
        const [sensors] = await connection.query(
            'SELECT sensor_id FROM FuelSensor WHERE vehicle_id = ?',
            [vehicle_id]
        );
        
        if (sensors.length === 0) {
            connection.release();
            return sendResponse(res, 'error', 'Sensor not found for vehicle', null);
        }
        
        const sensor_id = sensors[0].sensor_id;
        
        // Update fuel level (trigger will detect theft)
        await connection.query(
            'UPDATE FuelSensor SET last_fuel_level = ? WHERE sensor_id = ?',
            [fuel_level, sensor_id]
        );
        
        // Insert fuel log
        await connection.query(
            'INSERT INTO FuelLogs(vehicle_id, fuel_level) VALUES(?, ?)',
            [vehicle_id, fuel_level]
        );
        
        connection.release();
        sendResponse(res, 'success', 'Fuel level updated successfully');
    } catch (error) {
        handleError(res, error);
    }
});

// Get fuel logs
app.get('/api/getFuelLogs/:vehicle_id', async (req, res) => {
    try {
        const { vehicle_id } = req.params;
        const connection = await pool.getConnection();
        const [logs] = await connection.query(
            'SELECT * FROM FuelLogs WHERE vehicle_id = ? ORDER BY recorded_at DESC LIMIT 50',
            [vehicle_id]
        );
        connection.release();
        sendResponse(res, 'success', 'Fuel logs fetched successfully', logs);
    } catch (error) {
        handleError(res, error);
    }
});

// =====================================================
// ALERTS & EVENTS ENDPOINTS
// =====================================================

// Get alerts
app.get('/api/getAlerts', async (req, res) => {
    try {
        const { vehicle_id } = req.query;
        const connection = await pool.getConnection();
        
        let query = 'SELECT * FROM Alerts ORDER BY alert_time DESC LIMIT 100';
        let params = [];
        
        if (vehicle_id) {
            query = 'SELECT * FROM Alerts WHERE vehicle_id = ? ORDER BY alert_time DESC LIMIT 100';
            params = [vehicle_id];
        }
        
        const [alerts] = await connection.query(query, params);
        connection.release();
        sendResponse(res, 'success', 'Alerts fetched successfully', alerts);
    } catch (error) {
        console.log('Database error, using mock data for alerts');
        sendResponse(res, 'success', 'Alerts fetched successfully (demo mode)', mockData.alerts);
    }
});

// Get theft events
app.get('/api/getTheftEvents', async (req, res) => {
    try {
        const { vehicle_id } = req.query;
        const connection = await pool.getConnection();
        
        let query = 'SELECT t.*, v.owner_name, v.reg_number FROM FuelTheftEvents t JOIN Vehicles v ON t.vehicle_id = v.vehicle_id ORDER BY t.theft_detected_at DESC';
        let params = [];
        
        if (vehicle_id) {
            query = 'SELECT t.*, v.owner_name, v.reg_number FROM FuelTheftEvents t JOIN Vehicles v ON t.vehicle_id = v.vehicle_id WHERE t.vehicle_id = ? ORDER BY t.theft_detected_at DESC';
            params = [vehicle_id];
        }
        
        const [events] = await connection.query(query, params);
        connection.release();
        sendResponse(res, 'success', 'Theft events fetched successfully', events);
    } catch (error) {
        console.log('Database error, using mock data for theft events');
        sendResponse(res, 'success', 'Theft events fetched successfully (demo mode)', mockData.theftEvents);
    }
});

// Get theft history
app.get('/api/getTheftHistory/:vehicle_id', async (req, res) => {
    try {
        const { vehicle_id } = req.params;
        const connection = await pool.getConnection();
        const [history] = await connection.query(
            'SELECT * FROM FuelTheftEvents WHERE vehicle_id = ? ORDER BY theft_detected_at DESC',
            [vehicle_id]
        );
        connection.release();
        sendResponse(res, 'success', 'Theft history fetched successfully', history);
    } catch (error) {
        handleError(res, error);
    }
});

// =====================================================
// LOCK CONTROL ENDPOINTS
// =====================================================

// Lock vehicle
app.post('/api/lockVehicle', async (req, res) => {
    try {
        const { vehicle_id, reason } = req.body;
        
        if (!vehicle_id) {
            return sendResponse(res, 'error', 'Vehicle ID is required', null);
        }
        
        // Try database first
        try {
            const connection = await pool.getConnection();
            
            await connection.query(
                'UPDATE VehicleLockStatus SET is_locked = TRUE, lock_reason = ?, lock_time = NOW() WHERE vehicle_id = ?',
                [reason || 'MANUAL_LOCK', vehicle_id]
            );
            
            await connection.query(
                'INSERT INTO Alerts(vehicle_id, alert_message) VALUES(?, ?)',
                [vehicle_id, `🔒 Vehicle locked! Reason: ${reason || 'MANUAL_LOCK'}`]
            );
            
            connection.release();
            sendResponse(res, 'success', 'Vehicle locked successfully');
        } catch (dbError) {
            // Use mock data if database fails
            const vehicle = mockData.vehicles.find(v => v.vehicle_id == vehicle_id);
            if (vehicle) {
                vehicle.is_locked = 1;
                vehicle.lock_reason = reason || 'MANUAL_LOCK';
                vehicle.lock_time = new Date().toISOString();
                
                // Add alert
                mockData.alerts.push({
                    alert_id: mockData.alerts.length + 1,
                    vehicle_id: vehicle_id,
                    alert_message: `🔒 Vehicle locked! Reason: ${reason || 'MANUAL_LOCK'}`,
                    alert_time: new Date().toISOString(),
                    status: 'ACTIVE'
                });
                
                // Update stats
                mockData.stats.locked_vehicles++;
                mockData.stats.recent_alerts++;
                
                sendResponse(res, 'success', 'Vehicle locked successfully (demo mode)');
            } else {
                sendResponse(res, 'error', 'Vehicle not found', null);
            }
        }
    } catch (error) {
        handleError(res, error);
    }
});

// Unlock vehicle
app.post('/api/unlockVehicle', async (req, res) => {
    try {
        const { vehicle_id } = req.body;
        
        if (!vehicle_id) {
            return sendResponse(res, 'error', 'Vehicle ID is required', null);
        }
        
        // Try database first
        try {
            const connection = await pool.getConnection();
            
            await connection.query(
                'UPDATE VehicleLockStatus SET is_locked = FALSE, lock_reason = NULL, lock_time = NULL WHERE vehicle_id = ?',
                [vehicle_id]
            );
            
            await connection.query(
                'INSERT INTO Alerts(vehicle_id, alert_message) VALUES(?, ?)',
                [vehicle_id, '🔓 Vehicle unlocked!']
            );
            
            connection.release();
            sendResponse(res, 'success', 'Vehicle unlocked successfully');
        } catch (dbError) {
            // Use mock data if database fails
            const vehicle = mockData.vehicles.find(v => v.vehicle_id == vehicle_id);
            if (vehicle) {
                vehicle.is_locked = 0;
                vehicle.lock_reason = null;
                vehicle.lock_time = null;
                
                // Add alert
                mockData.alerts.push({
                    alert_id: mockData.alerts.length + 1,
                    vehicle_id: vehicle_id,
                    alert_message: '🔓 Vehicle unlocked!',
                    alert_time: new Date().toISOString(),
                    status: 'ACTIVE'
                });
                
                // Update stats
                mockData.stats.locked_vehicles--;
                mockData.stats.recent_alerts++;
                
                sendResponse(res, 'success', 'Vehicle unlocked successfully (demo mode)');
            } else {
                sendResponse(res, 'error', 'Vehicle not found', null);
            }
        }
    } catch (error) {
        handleError(res, error);
    }
});

// =====================================================
// STATISTICS ENDPOINTS
// =====================================================

// Get dashboard stats
app.get('/api/getDashboardStats', async (req, res) => {
    try {
        const connection = await pool.getConnection();
        
        const [totalVehicles] = await connection.query('SELECT COUNT(*) as count FROM Vehicles');
        const [lockedVehicles] = await connection.query('SELECT COUNT(*) as count FROM VehicleLockStatus WHERE is_locked = TRUE');
        const [theftEvents] = await connection.query('SELECT COUNT(*) as count FROM FuelTheftEvents');
        const [recentAlerts] = await connection.query('SELECT COUNT(*) as count FROM Alerts WHERE alert_time > DATE_SUB(NOW(), INTERVAL 24 HOUR)');
        const [totalFuelLoss] = await connection.query('SELECT COALESCE(SUM(fuel_loss), 0) as total FROM FuelTheftEvents');
        
        connection.release();
        
        const stats = {
            total_vehicles: totalVehicles[0].count,
            locked_vehicles: lockedVehicles[0].count,
            total_theft_events: theftEvents[0].count,
            recent_alerts: recentAlerts[0].count,
            total_fuel_loss: totalFuelLoss[0].total
        };
        
        sendResponse(res, 'success', 'Dashboard statistics fetched successfully', stats);
    } catch (error) {
        console.log('Database error, using mock data for dashboard stats');
        sendResponse(res, 'success', 'Dashboard statistics fetched successfully (demo mode)', mockData.stats);
    }
});

// Get vehicle fuel status
app.get('/api/getVehicleFuelStatus', async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const [status] = await connection.query(
            'SELECT v.vehicle_id, v.owner_name, v.reg_number, v.model, v.fuel_capacity, fs.last_fuel_level, ROUND((fs.last_fuel_level * 100) / v.fuel_capacity, 2) as fuel_percentage, vls.is_locked, vls.lock_reason, COUNT(DISTINCT fte.event_id) as theft_count FROM Vehicles v LEFT JOIN FuelSensor fs ON v.vehicle_id = fs.vehicle_id LEFT JOIN VehicleLockStatus vls ON v.vehicle_id = vls.vehicle_id LEFT JOIN FuelTheftEvents fte ON v.vehicle_id = fte.vehicle_id GROUP BY v.vehicle_id'
        );
        connection.release();
        sendResponse(res, 'success', 'Vehicle fuel status fetched successfully', status);
    } catch (error) {
        console.log('Database error, using mock data for fuel status');
        const fuelStatus = mockData.vehicles.map(v => ({
            vehicle_id: v.vehicle_id,
            owner_name: v.owner_name,
            reg_number: v.reg_number,
            model: v.model,
            fuel_capacity: v.fuel_capacity,
            last_fuel_level: v.last_fuel_level,
            fuel_percentage: Math.round((v.last_fuel_level / v.fuel_capacity) * 100 * 100) / 100,
            is_locked: v.is_locked,
            lock_reason: v.lock_reason,
            theft_count: 0
        }));
        sendResponse(res, 'success', 'Vehicle fuel status fetched successfully (demo mode)', fuelStatus);
    }
});

// =====================================================
// START SERVER
// =====================================================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`
    ╔════════════════════════════════════════════════╗
    ║  Smart Vehicle Fuel Theft Detection System     ║
    ║  Server running on: http://localhost:${PORT}    ║
    ║  Open in browser: http://localhost:${PORT}     ║
    ╚════════════════════════════════════════════════╝
    `);
});

module.exports = app;
