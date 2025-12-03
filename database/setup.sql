
-- Smart Vehicle Fuel Theft Detection & Lock Mechanism
-- Database Setup Script

CREATE DATABASE IF NOT EXISTS smart_fuel_theft;
USE smart_fuel_theft;

-- =====================================================
-- TABLE 1: Vehicles
-- =====================================================
CREATE TABLE IF NOT EXISTS Vehicles (
    vehicle_id INT AUTO_INCREMENT PRIMARY KEY,
    owner_name VARCHAR(100) NOT NULL,
    reg_number VARCHAR(20) UNIQUE NOT NULL,
    model VARCHAR(50),
    fuel_capacity INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TABLE 2: FuelSensor
-- =====================================================
CREATE TABLE IF NOT EXISTS FuelSensor (
    sensor_id INT AUTO_INCREMENT PRIMARY KEY,
    vehicle_id INT NOT NULL,
    last_fuel_level INT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (vehicle_id) REFERENCES Vehicles(vehicle_id) ON DELETE CASCADE
);

-- =====================================================
-- TABLE 3: FuelTheftEvents
-- =====================================================
CREATE TABLE IF NOT EXISTS FuelTheftEvents (
    event_id INT AUTO_INCREMENT PRIMARY KEY,
    vehicle_id INT NOT NULL,
    previous_level INT,
    current_level INT,
    fuel_loss INT,
    theft_detected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (vehicle_id) REFERENCES Vehicles(vehicle_id) ON DELETE CASCADE
);

-- =====================================================
-- TABLE 4: Alerts
-- =====================================================
CREATE TABLE IF NOT EXISTS Alerts (
    alert_id INT AUTO_INCREMENT PRIMARY KEY,
    vehicle_id INT NOT NULL,
    alert_message VARCHAR(255),
    is_read BOOLEAN DEFAULT FALSE,
    alert_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (vehicle_id) REFERENCES Vehicles(vehicle_id) ON DELETE CASCADE
);

-- =====================================================
-- TABLE 5: FuelLogs
-- =====================================================
CREATE TABLE IF NOT EXISTS FuelLogs (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    vehicle_id INT NOT NULL,
    fuel_level INT,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (vehicle_id) REFERENCES Vehicles(vehicle_id) ON DELETE CASCADE
);

-- =====================================================
-- TABLE 6: VehicleLockStatus
-- =====================================================
CREATE TABLE IF NOT EXISTS VehicleLockStatus (
    lock_id INT AUTO_INCREMENT PRIMARY KEY,
    vehicle_id INT NOT NULL UNIQUE,
    is_locked BOOLEAN DEFAULT FALSE,
    lock_reason VARCHAR(100),
    lock_time TIMESTAMP NULL,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (vehicle_id) REFERENCES Vehicles(vehicle_id) ON DELETE CASCADE
);

-- =====================================================
-- INSERT SAMPLE DATA
-- =====================================================
INSERT INTO Vehicles(owner_name, reg_number, model, fuel_capacity)
VALUES
('Amarjeet Yadav', 'PB10AB1234', 'Suzuki Access', 6),
('Rahul Kumar', 'PB07XY9876', 'Activa 6G', 5),
('Priya Sharma', 'PB09CD4590', 'Pulsar 150', 12);

INSERT INTO FuelSensor(vehicle_id, last_fuel_level)
VALUES 
(1, 5),
(2, 4),
(3, 11);

INSERT INTO FuelLogs(vehicle_id, fuel_level)
VALUES
(1, 5),
(2, 4),
(3, 11);

INSERT INTO VehicleLockStatus(vehicle_id, is_locked)
VALUES
(1, FALSE),
(2, FALSE),
(3, FALSE);

-- =====================================================
-- TRIGGER: Fuel Theft Detection & Auto Lock
-- =====================================================

-- Question:
-- “If the vehicle is running, fuel will naturally decrease.
-- So will the trigger think this is theft and activate auto-lock?”

-- the trigger will not activate during normal fuel consumption.
-- It only activates when there is a sudden and abnormal drop in fuel level, not a smooth gradual decrease.
DELIMITER $$
DROP TRIGGER IF EXISTS detect_fuel_theft $$
CREATE TRIGGER detect_fuel_theft 
BEFORE UPDATE ON FuelSensor
FOR EACH ROW
BEGIN
    IF NEW.last_fuel_level < OLD.last_fuel_level THEN
        
        INSERT INTO FuelTheftEvents(vehicle_id, previous_level, current_level, fuel_loss)
        VALUES(
            OLD.vehicle_id,
            OLD.last_fuel_level,
            NEW.last_fuel_level,
            OLD.last_fuel_level - NEW.last_fuel_level
        );

        INSERT INTO Alerts(vehicle_id, alert_message)
        VALUES(
            OLD.vehicle_id,
            CONCAT('🚨 ALERT: Fuel theft detected! Loss: ',
            OLD.last_fuel_level - NEW.last_fuel_level, ' liters. Previous: ',
            OLD.last_fuel_level, 'L → Current: ', NEW.last_fuel_level, 'L')
        );

        UPDATE VehicleLockStatus
        SET is_locked = TRUE,
            lock_reason = 'FUEL_THEFT_DETECTED',
            lock_time = NOW()
        WHERE vehicle_id = OLD.vehicle_id;
    END IF;
END 
$$ DELIMITER ;

-- =====================================================
-- VIEWS
-- =====================================================

-- View 1: Vehicle Fuel Status
DROP VIEW IF EXISTS VehicleFuelStatus;
CREATE VIEW VehicleFuelStatus AS
SELECT 
    v.vehicle_id,
    v.owner_name, 
    v.reg_number, 
    v.model,
    v.fuel_capacity,
    s.last_fuel_level, 
    s.updated_at,
    ROUND((s.last_fuel_level * 100) / v.fuel_capacity, 2) AS fuel_percentage
FROM Vehicles v
JOIN FuelSensor s ON v.vehicle_id = s.vehicle_id;

-- View 2: Theft Summary
DROP VIEW IF EXISTS TheftSummary;
CREATE VIEW TheftSummary AS
SELECT 
    v.vehicle_id,
    v.owner_name, 
    v.reg_number, 
    t.fuel_loss, 
    t.theft_detected_at,
    t.previous_level,
    t.current_level
FROM FuelTheftEvents t
JOIN Vehicles v ON t.vehicle_id = v.vehicle_id
ORDER BY t.theft_detected_at DESC;

-- View 3: Vehicle Lock Status View
DROP VIEW IF EXISTS VehicleLockStatusView;
CREATE VIEW VehicleLockStatusView AS
SELECT 
    v.vehicle_id,
    v.owner_name,
    v.reg_number,
    vls.is_locked,
    vls.lock_reason,
    vls.lock_time,
    vls.last_updated
FROM Vehicles v
JOIN VehicleLockStatus vls ON v.vehicle_id = vls.vehicle_id;

-- =====================================================
-- STORED PROCEDURES
-- =====================================================

-- Procedure 1: Get Fuel Logs
DELIMITER $$

DROP PROCEDURE IF EXISTS GetFuelLogs $$

CREATE PROCEDURE GetFuelLogs(IN vehid INT)
BEGIN
    SELECT * FROM FuelLogs 
    WHERE vehicle_id = vehid 
    ORDER BY recorded_at DESC 
    LIMIT 50;
END $$

DELIMITER ;

-- Procedure 2: Get Vehicle Theft History
DELIMITER $$

DROP PROCEDURE IF EXISTS GetTheftHistory $$

CREATE PROCEDURE GetTheftHistory(IN vehid INT)
BEGIN
    SELECT * FROM FuelTheftEvents 
    WHERE vehicle_id = vehid 
    ORDER BY theft_detected_at DESC;
END $$

DELIMITER ;

-- Procedure 3: Get All Alerts for Vehicle
DELIMITER $$

DROP PROCEDURE IF EXISTS GetVehicleAlerts $$

CREATE PROCEDURE GetVehicleAlerts(IN vehid INT)
BEGIN
    SELECT * FROM Alerts 
    WHERE vehicle_id = vehid 
    ORDER BY alert_time DESC 
    LIMIT 100;
END $$

DELIMITER ;

-- Procedure 4: Lock Vehicle
DELIMITER $$

DROP PROCEDURE IF EXISTS LockVehicle $$

CREATE PROCEDURE LockVehicle(IN vehid INT, IN reason VARCHAR(100))
BEGIN
    UPDATE VehicleLockStatus
    SET is_locked = TRUE,
        lock_reason = reason,
        lock_time = NOW()
    WHERE vehicle_id = vehid;
    
    INSERT INTO Alerts(vehicle_id, alert_message)
    VALUES(vehid, CONCAT('🔒 Vehicle locked! Reason: ', reason));
END $$

DELIMITER ;

-- Procedure 5: Unlock Vehicle
DELIMITER $$

DROP PROCEDURE IF EXISTS UnlockVehicle $$

CREATE PROCEDURE UnlockVehicle(IN vehid INT)
BEGIN
    UPDATE VehicleLockStatus
    SET is_locked = FALSE,
        lock_reason = NULL,
        lock_time = NULL
    WHERE vehicle_id = vehid;
    
    INSERT INTO Alerts(vehicle_id, alert_message)
    VALUES(vehid, '🔓 Vehicle unlocked!');
END $$

DELIMITER ;

-- Procedure 6: Low Fuel Check
DELIMITER $$

DROP PROCEDURE IF EXISTS LowFuelCheck $$

CREATE PROCEDURE LowFuelCheck()
BEGIN
    DECLARE done INT DEFAULT 0;
    DECLARE v_id INT;
    DECLARE lvl INT;
    DECLARE cap INT;

    DECLARE cur CURSOR FOR 
        SELECT fs.vehicle_id, fs.last_fuel_level, v.fuel_capacity 
        FROM FuelSensor fs 
        JOIN Vehicles v ON fs.vehicle_id = v.vehicle_id;
    
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;

    OPEN cur;

    read_loop: LOOP
        FETCH cur INTO v_id, lvl, cap;
        IF done THEN
            LEAVE read_loop;
        END IF;

        IF lvl < (cap * 0.2) THEN
            INSERT INTO Alerts(vehicle_id, alert_message)
            VALUES(v_id, CONCAT('⚠️ Warning: Fuel level critically low! Current: ', lvl, 'L of ', cap, 'L'));
        END IF;
    END LOOP;

    CLOSE cur;
END $$

DELIMITER ;

-- =====================================================
-- FUNCTIONS
-- =====================================================

-- Function 1: Calculate Fuel Percentage
DELIMITER $$

DROP FUNCTION IF EXISTS FuelPercentage $$

CREATE FUNCTION FuelPercentage(level_now INT, capacity INT)
RETURNS INT
DETERMINISTIC
BEGIN
    IF capacity = 0 THEN
        RETURN 0;
    END IF;
    RETURN (level_now * 100) / capacity;
END $$

DELIMITER ;

-- Function 2: Get Vehicle Theft Count
DELIMITER $$

DROP FUNCTION IF EXISTS GetTheftCount $$

CREATE FUNCTION GetTheftCount(vehid INT)
RETURNS INT
READS SQL DATA
BEGIN
    DECLARE count INT;
    SELECT COUNT(*) INTO count FROM FuelTheftEvents WHERE vehicle_id = vehid;
    RETURN count;
END $$

DELIMITER ;

-- Function 3: Get Total Fuel Loss
DELIMITER $$

DROP FUNCTION IF EXISTS GetTotalFuelLoss $$

CREATE FUNCTION GetTotalFuelLoss(vehid INT)
RETURNS INT
READS SQL DATA
BEGIN
    DECLARE total_loss INT;
    SELECT COALESCE(SUM(fuel_loss), 0) INTO total_loss FROM FuelTheftEvents WHERE vehicle_id = vehid;
    RETURN total_loss;
END $$

DELIMITER ;

-- =====================================================
-- INDEXES for Performance
-- =====================================================
CREATE INDEX idx_vehicle_id ON FuelSensor(vehicle_id);
CREATE INDEX idx_theft_vehicle ON FuelTheftEvents(vehicle_id);
CREATE INDEX idx_alert_vehicle ON Alerts(vehicle_id);
CREATE INDEX idx_log_vehicle ON FuelLogs(vehicle_id);
