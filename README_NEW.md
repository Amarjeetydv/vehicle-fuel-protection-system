# 🚗 Smart Vehicle Fuel Theft Detection System

A comprehensive real-time fuel theft detection and vehicle lock management system with automated alerts and comprehensive monitoring capabilities.

![System Architecture](https://img.shields.io/badge/Architecture-Microservices-brightgreen)
![Tech Stack](https://img.shields.io/badge/Stack-MERN-blue)
![Database](https://img.shields.io/badge/Database-MySQL-orange)
![Status](https://img.shields.io/badge/Status-Production%20Ready-success)

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Installation](#installation)
- [API Documentation](#api-documentation)
- [Usage Guide](#usage-guide)
- [Database Schema](#database-schema)
- [Demo Mode](#demo-mode)
- [Project Structure](#project-structure)
- [Deployment](#deployment)
- [License](#license)

---

## ✨ Features

### 🔐 Security & Lock Management
- **Vehicle Locking System** - Manually lock/unlock vehicles with custom reasons
- **Auto-Lock on Theft** - Automatically locks vehicle when fuel theft is detected
- **Real-time Lock Status** - Live tracking of all vehicle lock statuses
- **Audit Trail** - Complete logging of all lock/unlock actions

### 🚨 Theft Detection
- **Real-time Monitoring** - Continuous fuel level monitoring across fleet
- **Intelligent Detection** - Automatic theft detection when fuel decreases abnormally
- **Event Logging** - Detailed records of all suspected theft events
- **Instant Alerts** - Immediate notifications when theft is detected

### 📊 Dashboard & Analytics
- **Live Statistics** - Total vehicles, locked vehicles, theft events, total fuel loss
- **Fuel Status Overview** - Real-time fuel percentage for all vehicles
- **Alert Center** - Centralized alert management system
- **Historical Reports** - Complete theft and fuel history tracking

### 🛠️ Vehicle Management
- **Fleet Management** - Add, view, and manage unlimited vehicles
- **Fuel Level Tracking** - Update and monitor fuel levels in real-time
- **Sensor Integration** - Real-time fuel sensor readings
- **Vehicle Details** - Comprehensive vehicle information and specifications

### 📱 User Interface
- **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- **Interactive Dashboard** - Beautiful charts and real-time updates
- **Intuitive Controls** - Easy-to-use buttons and navigation
- **Professional Styling** - Bootstrap 5 responsive design

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI framework with hooks
- **Bootstrap 5** - Responsive CSS framework
- **HTML5 & CSS3** - Semantic markup and styling
- **JavaScript (ES6+)** - Modern JavaScript features

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Fast REST API framework
- **MySQL 5.7+** - Relational database
- **CORS** - Cross-origin resource sharing
- **Dotenv** - Environment configuration

### Database Features
- **MySQL Triggers** - Automatic theft detection logic
- **Stored Procedures** - Reusable database operations
- **Views** - Data aggregation and reporting
- **Functions** - Custom calculations and analytics
- **Indexes** - Performance optimization

---

## 🚀 Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/smart-vehicle-fuel-theft-detection.git
cd DBMSCA3

# 2. Install dependencies
npm install

# 3. Start the server (runs on port 3000)
npm start

# 4. Open in browser
# Navigate to http://localhost:3000/index.html
```

---

## 📦 Installation

### Prerequisites
- **Node.js** v14+ ([Download](https://nodejs.org/))
- **MySQL** 5.7+ ([Download](https://www.mysql.com/downloads/))
- **Git** ([Download](https://git-scm.com/))
- **npm** (comes with Node.js)

### Step 1: Clone Repository
```bash
git clone https://github.com/yourusername/smart-vehicle-fuel-theft-detection.git
cd DBMSCA3
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Configure Environment Variables
Create a `.env` file in the root directory:
```env
DB_HOST=localhost
DB_USER=root
DB_PASS=your_mysql_password
DB_NAME=smart_fuel_theft
PORT=3000
NODE_ENV=development
```

### Step 4: Setup Database (Optional - for persistent data)
```bash
# Option 1: Direct import
mysql -u root -p < database/setup.sql

# Option 2: Inside MySQL command line
mysql -u root -p
mysql> source database/setup.sql;
```

### Step 5: Start the Server
```bash
# Production mode
npm start

# Development mode (auto-reload on changes)
npm run dev
```

### Step 6: Access the Application
Open your browser and navigate to:
```
http://localhost:3000/index.html
```

---

## 📡 API Documentation

### Base URL
```
http://localhost:3000/api
```

### 12 Available Endpoints

#### Vehicle Management (3 endpoints)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/getAllVehicles` | Fetch all vehicles with lock status |
| GET | `/getVehicle/:id` | Get specific vehicle details |
| POST | `/addVehicle` | Add new vehicle to system |

#### Fuel Management (2 endpoints)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/updateFuelLevel` | Update current fuel level |
| GET | `/getFuelLogs/:id` | Get fuel history for vehicle |

#### Lock Control (2 endpoints)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/lockVehicle` | Lock a vehicle with reason |
| POST | `/unlockVehicle` | Unlock a vehicle |

#### Alerts & Events (3 endpoints)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/getAlerts` | Fetch all system alerts |
| GET | `/getTheftEvents` | Get fuel theft events |
| GET | `/getTheftHistory/:id` | Get theft history for vehicle |

#### Statistics (2 endpoints)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/getDashboardStats` | Get dashboard statistics |
| GET | `/getVehicleFuelStatus` | Get fuel status for all vehicles |

### Example API Requests

**Lock Vehicle:**
```bash
curl -X POST http://localhost:3000/api/lockVehicle \
  -H "Content-Type: application/json" \
  -d '{"vehicle_id": 1, "reason": "FUEL_THEFT_DETECTED"}'
```

**Get All Vehicles:**
```bash
curl http://localhost:3000/api/getAllVehicles
```

**Update Fuel Level:**
```bash
curl -X POST http://localhost:3000/api/updateFuelLevel \
  -H "Content-Type: application/json" \
  -d '{"vehicle_id": 1, "fuel_level": 40}'
```

**Get Dashboard Stats:**
```bash
curl http://localhost:3000/api/getDashboardStats
```

---

## 📖 Usage Guide

### Dashboard Tab
- View key statistics (total vehicles, locked vehicles, alerts)
- See real-time fuel status with progress bars
- Monitor recent alerts
- Track fuel theft events

### Vehicles Tab
- View all registered vehicles
- See vehicle owner, registration, and model
- Check current fuel level and percentage
- **Lock/Unlock** vehicles with one click
- Add new vehicles
- Update fuel levels

### Alerts Tab
- View all system alerts
- See lock/unlock notifications
- Monitor theft detection alerts
- Check fuel level warnings

### Theft Events Tab
- Review all fuel theft incidents
- See fuel loss amounts
- Check detection timestamps
- Analyze patterns

---

## 🗄️ Database Schema

### Core Tables (6 Total)

**Vehicles** - Vehicle information
```sql
CREATE TABLE Vehicles (
    vehicle_id INT PRIMARY KEY AUTO_INCREMENT,
    owner_name VARCHAR(100) NOT NULL,
    reg_number VARCHAR(20) UNIQUE NOT NULL,
    model VARCHAR(50),
    fuel_capacity INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**FuelSensor** - Current fuel levels
```sql
CREATE TABLE FuelSensor (
    sensor_id INT PRIMARY KEY AUTO_INCREMENT,
    vehicle_id INT NOT NULL,
    last_fuel_level INT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (vehicle_id) REFERENCES Vehicles(vehicle_id) ON DELETE CASCADE
);
```

**FuelTheftEvents** - Theft detection records
```sql
CREATE TABLE FuelTheftEvents (
    event_id INT PRIMARY KEY AUTO_INCREMENT,
    vehicle_id INT NOT NULL,
    previous_level INT,
    current_level INT,
    fuel_loss INT,
    theft_detected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (vehicle_id) REFERENCES Vehicles(vehicle_id) ON DELETE CASCADE
);
```

**VehicleLockStatus** - Lock status tracking
```sql
CREATE TABLE VehicleLockStatus (
    lock_id INT PRIMARY KEY AUTO_INCREMENT,
    vehicle_id INT NOT NULL UNIQUE,
    is_locked BOOLEAN DEFAULT FALSE,
    lock_reason VARCHAR(100),
    lock_time TIMESTAMP NULL,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (vehicle_id) REFERENCES Vehicles(vehicle_id) ON DELETE CASCADE
);
```

**Alerts** - System alerts
```sql
CREATE TABLE Alerts (
    alert_id INT PRIMARY KEY AUTO_INCREMENT,
    vehicle_id INT NOT NULL,
    alert_message VARCHAR(255),
    is_read BOOLEAN DEFAULT FALSE,
    alert_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (vehicle_id) REFERENCES Vehicles(vehicle_id) ON DELETE CASCADE
);
```

**FuelLogs** - Fuel history
```sql
CREATE TABLE FuelLogs (
    log_id INT PRIMARY KEY AUTO_INCREMENT,
    vehicle_id INT NOT NULL,
    fuel_level INT,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (vehicle_id) REFERENCES Vehicles(vehicle_id) ON DELETE CASCADE
);
```

### Advanced Database Features

**Triggers**
- `detect_fuel_theft` - Automatically detects when fuel level decreases and locks vehicle

**Views**
- `VehicleFuelStatus` - Real-time fuel status for all vehicles
- `TheftSummary` - Summary of all theft events
- `VehicleLockStatusView` - Lock status overview

**Stored Procedures**
- `GetFuelLogs(vehicle_id)` - Get fuel logs for a vehicle
- `GetTheftHistory(vehicle_id)` - Get theft history
- `GetVehicleAlerts(vehicle_id)` - Get alerts for a vehicle
- `LockVehicle(vehicle_id, reason)` - Lock a vehicle
- `UnlockVehicle(vehicle_id)` - Unlock a vehicle
- `LowFuelCheck()` - Check for low fuel levels

**Functions**
- `FuelPercentage(level, capacity)` - Calculate fuel percentage
- `GetTheftCount(vehicle_id)` - Get total thefts for vehicle
- `GetTotalFuelLoss(vehicle_id)` - Get total fuel loss for vehicle

---

## 🎮 Demo Mode

The system includes a **Demo Mode** that works without a database connection:

✅ **All Features Fully Functional**
- Vehicle management
- Lock/unlock operations
- Alert generation
- Statistics tracking
- Real-time updates

✅ **Pre-loaded Sample Data**
- 3 sample vehicles with mock data
- Automatic alert generation
- Live statistics updates

⚠️ **Demo Mode Limitations**
- Data resets when server restarts
- No persistent storage
- In-memory operations only

**When to Use Demo Mode:**
- Development and testing
- Demonstrations and presentations
- Learning the system
- Quick prototyping

---

## 📁 Project Structure

```
DBMSCA3/
├── backend/
│   ├── server.js                 # Express.js API server
│   └── package.json              # Node.js configuration
├── frontend/
│   ├── app.jsx                   # React main component
│   └── index.html                # HTML entry point
├── database/
│   ├── setup.sql                 # Database schema & triggers
│   └── BACKEND_FEATURES_GUIDE.md # Feature documentation
├── docs/
│   └── API_DOCUMENTATION.md      # Complete API reference
├── .env                          # Environment variables
├── .gitignore                    # Git ignore rules
├── package.json                  # Node.js dependencies
└── README.md                     # This file
```

---

## 🌐 Deployment

### Cloud Deployment Options

**Heroku:**
```bash
heroku create your-app-name
git push heroku main
```

**AWS:**
- Use Elastic Beanstalk for Node.js
- RDS for MySQL database
- Configure environment variables

**DigitalOcean:**
```bash
# SSH into your droplet
ssh root@your-droplet-ip

# Clone repository
git clone https://github.com/yourusername/smart-vehicle-fuel-theft-detection.git

# Install Node.js and npm
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install MySQL
sudo apt-get install -y mysql-server

# Setup and start
npm install
npm start
```

**Docker:**
```bash
docker build -t fuel-theft-detection .
docker run -p 3000:3000 \
  -e DB_HOST=mysql \
  -e DB_USER=root \
  -e DB_PASS=password \
  fuel-theft-detection
```

---

## 🐛 Troubleshooting

### Server won't start
```bash
# Check if port 3000 is already in use
# On Windows, kill process on port 3000
netstat -ano | findstr :3000

# On Linux/Mac
lsof -i :3000

# Or change PORT in .env file
```

### Database connection error
```bash
# Verify MySQL is running
# Check credentials in .env
# Ensure database exists
mysql -u root -p
mysql> CREATE DATABASE smart_fuel_theft;
```

### Module not found
```bash
# Clean reinstall
rm -rf node_modules package-lock.json
npm install
```

### CORS errors
- Ensure backend server is running on port 3000
- Check CORS is enabled in server.js
- Verify browser console for detailed error

---

## 📊 Sample Data

| Vehicle | Owner | Registration | Model | Capacity |
|---------|-------|--------------|-------|----------|
| 1 | Amarjeet Yadav | PB10AB1234 | Suzuki Access | 6L |
| 2 | Rahul Kumar | PB07XY9876 | Activa 6G | 5L |
| 3 | Priya Sharma | PB09CD4590 | Pulsar 150 | 12L |

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- Email: your.email@example.com

---

## 🙏 Acknowledgments

- Bootstrap for responsive UI
- React for frontend framework
- Express.js for backend API
- MySQL for database
- Node.js community

---

## 📞 Support

For support, please:
- Open an issue on GitHub
- Email: support@example.com
- Check the troubleshooting section above

---

## 🚀 Roadmap

- [ ] Mobile app (React Native)
- [ ] GPS tracking integration
- [ ] SMS/Email notifications
- [ ] Advanced analytics dashboard
- [ ] Machine learning theft prediction
- [ ] Multi-language support
- [ ] Dark mode UI
- [ ] Real-time WebSocket updates

---

## ⭐ Show Your Support

If you found this project helpful, please give it a star on GitHub!

---

*Last Updated: December 3, 2025*
*Version: 1.0.0*
*Status: Production Ready* ✅
