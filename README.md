# Smart Vehicle Fuel Theft Detection System

A real-time fuel theft detection and vehicle lock management system with automated alerts and comprehensive monitoring capabilities.

## Features

**Security & Lock Management**
- Manual vehicle lock/unlock with custom reasons
- Automatic vehicle locking when fuel theft is detected
- Real-time lock status tracking
- Complete audit trail of lock/unlock actions

**Theft Detection**
- Continuous fuel level monitoring
- Automatic theft detection on abnormal fuel decrease
- Detailed event logging and records
- Instant alert notifications

**Dashboard & Analytics**
- Real-time system statistics
- Live fuel status overview with percentage tracking
- Centralized alert management
- Historical theft and fuel records

**Vehicle Management**
- Fleet management with unlimited vehicles
- Real-time fuel level monitoring
- Fuel sensor integration
- Comprehensive vehicle information storage

**User Interface**
- Responsive design for desktop, tablet, and mobile
- Interactive dashboard with real-time updates
- Intuitive navigation and controls
- Clean, professional styling

---

## Tech Stack

**Frontend**
- React 18
- Bootstrap 5
- HTML5 & CSS3
- JavaScript ES6+

**Backend**
- Node.js
- Express.js
- MySQL 5.7+
- CORS enabled

**Database**
- MySQL triggers for automatic theft detection
- Stored procedures for data operations
- Database views for data aggregation
- Custom functions for analytics

---

## Quick Start

```bash
# Install dependencies
npm install

# Start the server (port 3000)
npm start

# Open in browser
http://localhost:3000/index.html
```

---

## Installation

**Prerequisites**
- Node.js v14+
- MySQL 5.7+
- npm (included with Node.js)

**Setup Steps**

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file in root directory:
```env
DB_HOST=localhost
DB_USER=root
DB_PASS=your_password
DB_NAME=smart_fuel_theft
PORT=3000
NODE_ENV=development
```

3. Setup database (optional):
```bash
mysql -u root -p < database/setup.sql
```

4. Start the server:
```bash
npm start
```

5. Access the application:
```
http://localhost:3000/index.html
```

---

## API Documentation

**Base URL:** `http://localhost:3000/api`

**Vehicle Management**
- `GET /getAllVehicles` - Fetch all vehicles
- `GET /getVehicle/:id` - Get vehicle details
- `POST /addVehicle` - Add new vehicle

**Fuel Management**
- `POST /updateFuelLevel` - Update fuel level
- `GET /getFuelLogs/:id` - Get fuel history

**Lock Control**
- `POST /lockVehicle` - Lock a vehicle
- `POST /unlockVehicle` - Unlock a vehicle

**Alerts & Events**
- `GET /getAlerts` - Fetch alerts
- `GET /getTheftEvents` - Get theft events
- `GET /getTheftHistory/:id` - Get theft history

**Statistics**
- `GET /getDashboardStats` - Get dashboard stats
- `GET /getVehicleFuelStatus` - Get fuel status

---

## Database Schema

**Core Tables**

- **Vehicles** - Vehicle information and specifications
- **FuelSensor** - Current fuel level readings
- **FuelTheftEvents** - Theft detection records
- **VehicleLockStatus** - Vehicle lock status tracking
- **Alerts** - System alerts and notifications
- **FuelLogs** - Historical fuel level records

---

## Project Structure

```
DBMSCA3/
├── backend/
│   └── server.js              # Express API server
├── frontend/
│   ├── app.jsx                # React component
│   └── index.html             # HTML entry point
├── database/
│   └── setup.sql              # Database schema
├── .env                       # Environment variables
├── package.json               # Dependencies
└── README.md                  # Documentation
```

---

## Usage

**Dashboard Tab**
- View system statistics
- Monitor real-time fuel status
- Check recent alerts
- Track theft events

**Vehicles Tab**
- View all vehicles
- Lock/unlock vehicles
- Update fuel levels
- Add new vehicles

**Alerts Tab**
- View system notifications
- Monitor lock/unlock events
- Track theft alerts

**Theft Events Tab**
- Review fuel theft incidents
- Check fuel loss data
- Analyze detection timestamps

---

## Running the Application

**Development Mode:**
```bash
npm run dev
```

**Production Mode:**
```bash
npm start
```

---

## Troubleshooting

**Server won't start**
- Check if port 3000 is available
- Verify Node.js installation

**Database connection error**
- Ensure MySQL is running
- Verify credentials in `.env`
- Check database exists

**Module not found**
```bash
rm -rf node_modules package-lock.json
npm install
```


