<?php
require_once 'config.php';

$db = new Database();
$db->connect();
$conn = $db->getConnection();

$action = isset($_GET['action']) ? $_GET['action'] : '';

switch($action) {
    case 'getAllVehicles':
        getAllVehicles($conn);
        break;
    case 'getVehicle':
        getVehicle($conn);
        break;
    case 'addVehicle':
        addVehicle($conn);
        break;
    case 'updateFuelLevel':
        updateFuelLevel($conn);
        break;
    case 'getAlerts':
        getAlerts($conn);
        break;
    case 'getTheftEvents':
        getTheftEvents($conn);
        break;
    case 'lockVehicle':
        lockVehicle($conn);
        break;
    case 'unlockVehicle':
        unlockVehicle($conn);
        break;
    case 'getFuelLogs':
        getFuelLogs($conn);
        break;
    case 'getTheftHistory':
        getTheftHistory($conn);
        break;
    case 'getDashboardStats':
        getDashboardStats($conn);
        break;
    case 'getVehicleFuelStatus':
        getVehicleFuelStatus($conn);
        break;
    default:
        echo json_encode(Response::error('Invalid action'));
}

// Get all vehicles
function getAllVehicles($conn) {
    $sql = "SELECT v.*, fs.last_fuel_level, vls.is_locked 
            FROM Vehicles v 
            LEFT JOIN FuelSensor fs ON v.vehicle_id = fs.vehicle_id 
            LEFT JOIN VehicleLockStatus vls ON v.vehicle_id = vls.vehicle_id";
    
    $result = $conn->query($sql);
    
    if (!$result) {
        echo json_encode(Response::error($conn->error));
        return;
    }
    
    $vehicles = [];
    while($row = $result->fetch_assoc()) {
        $vehicles[] = $row;
    }
    
    echo json_encode(Response::success($vehicles, "Vehicles fetched successfully"));
}

// Get single vehicle
function getVehicle($conn) {
    if (!isset($_GET['vehicle_id'])) {
        echo json_encode(Response::error('Vehicle ID is required'));
        return;
    }
    
    $vehicle_id = intval($_GET['vehicle_id']);
    
    $sql = "SELECT v.*, fs.last_fuel_level, vls.is_locked, vls.lock_reason 
            FROM Vehicles v 
            LEFT JOIN FuelSensor fs ON v.vehicle_id = fs.vehicle_id 
            LEFT JOIN VehicleLockStatus vls ON v.vehicle_id = vls.vehicle_id
            WHERE v.vehicle_id = ?";
    
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('i', $vehicle_id);
    $stmt->execute();
    
    $result = $stmt->get_result();
    $vehicle = $result->fetch_assoc();
    
    if (!$vehicle) {
        echo json_encode(Response::error('Vehicle not found', 404));
        return;
    }
    
    echo json_encode(Response::success($vehicle, "Vehicle fetched successfully"));
}

// Add new vehicle
function addVehicle($conn) {
    $data = json_decode(file_get_contents("php://input"), true);
    
    if (!isset($data['owner_name']) || !isset($data['reg_number']) || !isset($data['fuel_capacity'])) {
        echo json_encode(Response::error('Required fields: owner_name, reg_number, fuel_capacity'));
        return;
    }
    
    $owner_name = $data['owner_name'];
    $reg_number = $data['reg_number'];
    $model = $data['model'] ?? '';
    $fuel_capacity = intval($data['fuel_capacity']);
    
    $sql = "INSERT INTO Vehicles(owner_name, reg_number, model, fuel_capacity) VALUES(?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('sssi', $owner_name, $reg_number, $model, $fuel_capacity);
    
    if (!$stmt->execute()) {
        echo json_encode(Response::error($conn->error));
        return;
    }
    
    $vehicle_id = $conn->insert_id;
    
    // Insert sensor entry
    $sql = "INSERT INTO FuelSensor(vehicle_id, last_fuel_level) VALUES(?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('ii', $vehicle_id, $fuel_capacity);
    $stmt->execute();
    
    // Insert lock status
    $sql = "INSERT INTO VehicleLockStatus(vehicle_id, is_locked) VALUES(?, 0)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('i', $vehicle_id);
    $stmt->execute();
    
    echo json_encode(Response::success(['vehicle_id' => $vehicle_id], "Vehicle added successfully"));
}

// Update fuel level
function updateFuelLevel($conn) {
    $data = json_decode(file_get_contents("php://input"), true);
    
    if (!isset($data['vehicle_id']) || !isset($data['fuel_level'])) {
        echo json_encode(Response::error('Required fields: vehicle_id, fuel_level'));
        return;
    }
    
    $vehicle_id = intval($data['vehicle_id']);
    $fuel_level = intval($data['fuel_level']);
    
    // Get sensor_id
    $sql = "SELECT sensor_id FROM FuelSensor WHERE vehicle_id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('i', $vehicle_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $sensor = $result->fetch_assoc();
    
    if (!$sensor) {
        echo json_encode(Response::error('Sensor not found for vehicle'));
        return;
    }
    
    $sensor_id = $sensor['sensor_id'];
    
    // Update fuel level (trigger will detect theft)
    $sql = "UPDATE FuelSensor SET last_fuel_level = ? WHERE sensor_id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('ii', $fuel_level, $sensor_id);
    
    if (!$stmt->execute()) {
        echo json_encode(Response::error($conn->error));
        return;
    }
    
    // Insert fuel log
    $sql = "INSERT INTO FuelLogs(vehicle_id, fuel_level) VALUES(?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('ii', $vehicle_id, $fuel_level);
    $stmt->execute();
    
    echo json_encode(Response::success([], "Fuel level updated successfully"));
}

// Get alerts for vehicle
function getAlerts($conn) {
    $vehicle_id = isset($_GET['vehicle_id']) ? intval($_GET['vehicle_id']) : 0;
    
    if ($vehicle_id > 0) {
        $sql = "SELECT * FROM Alerts WHERE vehicle_id = ? ORDER BY alert_time DESC LIMIT 100";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param('i', $vehicle_id);
        $stmt->execute();
        $result = $stmt->get_result();
    } else {
        $sql = "SELECT * FROM Alerts ORDER BY alert_time DESC LIMIT 100";
        $result = $conn->query($sql);
    }
    
    $alerts = [];
    while($row = $result->fetch_assoc()) {
        $alerts[] = $row;
    }
    
    echo json_encode(Response::success($alerts, "Alerts fetched successfully"));
}

// Get theft events
function getTheftEvents($conn) {
    $vehicle_id = isset($_GET['vehicle_id']) ? intval($_GET['vehicle_id']) : 0;
    
    if ($vehicle_id > 0) {
        $sql = "SELECT t.*, v.owner_name, v.reg_number FROM FuelTheftEvents t 
                JOIN Vehicles v ON t.vehicle_id = v.vehicle_id 
                WHERE t.vehicle_id = ? ORDER BY t.theft_detected_at DESC";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param('i', $vehicle_id);
        $stmt->execute();
        $result = $stmt->get_result();
    } else {
        $sql = "SELECT t.*, v.owner_name, v.reg_number FROM FuelTheftEvents t 
                JOIN Vehicles v ON t.vehicle_id = v.vehicle_id 
                ORDER BY t.theft_detected_at DESC";
        $result = $conn->query($sql);
    }
    
    $events = [];
    while($row = $result->fetch_assoc()) {
        $events[] = $row;
    }
    
    echo json_encode(Response::success($events, "Theft events fetched successfully"));
}

// Lock vehicle
function lockVehicle($conn) {
    $data = json_decode(file_get_contents("php://input"), true);
    
    if (!isset($data['vehicle_id'])) {
        echo json_encode(Response::error('Vehicle ID is required'));
        return;
    }
    
    $vehicle_id = intval($data['vehicle_id']);
    $reason = $data['reason'] ?? 'MANUAL_LOCK';
    
    $sql = "CALL LockVehicle(?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('is', $vehicle_id, $reason);
    
    if (!$stmt->execute()) {
        echo json_encode(Response::error($conn->error));
        return;
    }
    
    echo json_encode(Response::success([], "Vehicle locked successfully"));
}

// Unlock vehicle
function unlockVehicle($conn) {
    $data = json_decode(file_get_contents("php://input"), true);
    
    if (!isset($data['vehicle_id'])) {
        echo json_encode(Response::error('Vehicle ID is required'));
        return;
    }
    
    $vehicle_id = intval($data['vehicle_id']);
    
    $sql = "CALL UnlockVehicle(?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('i', $vehicle_id);
    
    if (!$stmt->execute()) {
        echo json_encode(Response::error($conn->error));
        return;
    }
    
    echo json_encode(Response::success([], "Vehicle unlocked successfully"));
}

// Get fuel logs
function getFuelLogs($conn) {
    if (!isset($_GET['vehicle_id'])) {
        echo json_encode(Response::error('Vehicle ID is required'));
        return;
    }
    
    $vehicle_id = intval($_GET['vehicle_id']);
    
    $sql = "CALL GetFuelLogs(?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('i', $vehicle_id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    $logs = [];
    while($row = $result->fetch_assoc()) {
        $logs[] = $row;
    }
    
    echo json_encode(Response::success($logs, "Fuel logs fetched successfully"));
}

// Get theft history
function getTheftHistory($conn) {
    if (!isset($_GET['vehicle_id'])) {
        echo json_encode(Response::error('Vehicle ID is required'));
        return;
    }
    
    $vehicle_id = intval($_GET['vehicle_id']);
    
    $sql = "CALL GetTheftHistory(?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('i', $vehicle_id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    $history = [];
    while($row = $result->fetch_assoc()) {
        $history[] = $row;
    }
    
    echo json_encode(Response::success($history, "Theft history fetched successfully"));
}

// Get dashboard statistics
function getDashboardStats($conn) {
    $stats = [];
    
    // Total vehicles
    $result = $conn->query("SELECT COUNT(*) as count FROM Vehicles");
    $stats['total_vehicles'] = $result->fetch_assoc()['count'];
    
    // Locked vehicles
    $result = $conn->query("SELECT COUNT(*) as count FROM VehicleLockStatus WHERE is_locked = TRUE");
    $stats['locked_vehicles'] = $result->fetch_assoc()['count'];
    
    // Total theft events
    $result = $conn->query("SELECT COUNT(*) as count FROM FuelTheftEvents");
    $stats['total_theft_events'] = $result->fetch_assoc()['count'];
    
    // Recent alerts
    $result = $conn->query("SELECT COUNT(*) as count FROM Alerts WHERE alert_time > DATE_SUB(NOW(), INTERVAL 24 HOUR)");
    $stats['recent_alerts'] = $result->fetch_assoc()['count'];
    
    // Total fuel loss
    $result = $conn->query("SELECT COALESCE(SUM(fuel_loss), 0) as total FROM FuelTheftEvents");
    $stats['total_fuel_loss'] = $result->fetch_assoc()['total'];
    
    echo json_encode(Response::success($stats, "Dashboard statistics fetched successfully"));
}

// Get vehicle fuel status
function getVehicleFuelStatus($conn) {
    $sql = "SELECT v.vehicle_id, v.owner_name, v.reg_number, v.model, v.fuel_capacity, 
                   fs.last_fuel_level, 
                   ROUND((fs.last_fuel_level * 100) / v.fuel_capacity, 2) as fuel_percentage,
                   vls.is_locked,
                   COUNT(DISTINCT fte.event_id) as theft_count
            FROM Vehicles v
            LEFT JOIN FuelSensor fs ON v.vehicle_id = fs.vehicle_id
            LEFT JOIN VehicleLockStatus vls ON v.vehicle_id = vls.vehicle_id
            LEFT JOIN FuelTheftEvents fte ON v.vehicle_id = fte.vehicle_id
            GROUP BY v.vehicle_id";
    
    $result = $conn->query($sql);
    
    $status = [];
    while($row = $result->fetch_assoc()) {
        $status[] = $row;
    }
    
    echo json_encode(Response::success($status, "Vehicle fuel status fetched successfully"));
}

?>
