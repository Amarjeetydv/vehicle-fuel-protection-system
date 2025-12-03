<?php
// Database Configuration
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'smart_fuel_theft');

// Headers for CORS and JSON
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// Database Connection
class Database {
    private $conn;
    
    public function connect() {
        $this->conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
        
        if ($this->conn->connect_error) {
            die(json_encode(['error' => 'Connection failed: ' . $this->conn->connect_error]));
        }
        
        return $this->conn;
    }
    
    public function getConnection() {
        return $this->conn;
    }
}

// Response Handler
class Response {
    public static function success($data, $message = "Success") {
        return [
            'status' => 'success',
            'message' => $message,
            'data' => $data
        ];
    }
    
    public static function error($message, $code = 400) {
        http_response_code($code);
        return [
            'status' => 'error',
            'message' => $message,
            'data' => null
        ];
    }
}
?>
