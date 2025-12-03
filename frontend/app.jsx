// Smart Vehicle Fuel Theft Detection System - React Component
class SmartFuelTheftApp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeTab: 'dashboard',
            vehicles: [],
            alerts: [],
            theftEvents: [],
            selectedVehicle: null,
            stats: {},
            loading: false,
            error: null,
            showAddVehicleModal: false,
            showFuelModal: false,
            newVehicle: { owner_name: '', reg_number: '', model: '', fuel_capacity: '' },
            fuelUpdate: { vehicle_id: '', fuel_level: '' },
            vehicleFuelStatus: []
        };
        
        this.apiBase = 'http://localhost:3000/api';
    }
    
    componentDidMount() {
        this.loadDashboard();
        // Refresh every 5 seconds
        setInterval(() => {
            if (this.state.activeTab === 'dashboard') {
                this.loadDashboard();
            }
        }, 5000);
    }
    
    loadDashboard = () => {
        this.setState({ loading: true });
        Promise.all([
            fetch(`${this.apiBase}/getDashboardStats`).then(r => r.json()),
            fetch(`${this.apiBase}/getVehicleFuelStatus`).then(r => r.json()),
            fetch(`${this.apiBase}/getAlerts`).then(r => r.json()),
            fetch(`${this.apiBase}/getAllVehicles`).then(r => r.json()),
            fetch(`${this.apiBase}/getTheftEvents`).then(r => r.json())
        ]).then(([stats, status, alerts, vehicles, theft]) => {
            // Use fuel status vehicles which have all the needed fields
            const vehiclesData = status.data && status.data.length > 0 ? status.data : vehicles.data || [];
            
            this.setState({
                stats: stats.data || {},
                vehicleFuelStatus: status.data || [],
                alerts: alerts.data || [],
                vehicles: vehiclesData,
                theftEvents: theft.data || [],
                loading: false
            });
        }).catch(err => {
            this.setState({ error: 'Failed to load dashboard', loading: false });
            console.error(err);
        });
    }
    
    loadVehicleDetails = (vehicleId) => {
        Promise.all([
            fetch(`${this.apiBase}/getVehicle/${vehicleId}`).then(r => r.json()),
            fetch(`${this.apiBase}/getFuelLogs/${vehicleId}`).then(r => r.json()),
            fetch(`${this.apiBase}/getTheftHistory/${vehicleId}`).then(r => r.json())
        ]).then(([vehicle, logs, theft]) => {
            this.setState({
                selectedVehicle: vehicle.data,
                fuelLogs: logs.data || [],
                theftHistory: theft.data || []
            });
        }).catch(err => console.error(err));
    }
    
    addVehicle = () => {
        const { newVehicle } = this.state;
        if (!newVehicle.owner_name || !newVehicle.reg_number || !newVehicle.fuel_capacity) {
            alert('Please fill all required fields');
            return;
        }
        
        fetch(`${this.apiBase}/addVehicle`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newVehicle)
        }).then(r => r.json())
        .then(res => {
            if (res.status === 'success') {
                alert('Vehicle added successfully!');
                this.setState({
                    showAddVehicleModal: false,
                    newVehicle: { owner_name: '', reg_number: '', model: '', fuel_capacity: '' }
                });
                this.loadDashboard();
            } else {
                alert('Error: ' + res.message);
            }
        }).catch(err => console.error(err));
    }
    
    updateFuelLevel = () => {
        const { fuelUpdate } = this.state;
        if (!fuelUpdate.vehicle_id || fuelUpdate.fuel_level === '') {
            alert('Please select vehicle and enter fuel level');
            return;
        }
        
        fetch(`${this.apiBase}/updateFuelLevel`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                vehicle_id: parseInt(fuelUpdate.vehicle_id),
                fuel_level: parseInt(fuelUpdate.fuel_level)
            })
        }).then(r => r.json())
        .then(res => {
            if (res.status === 'success') {
                alert('Fuel level updated!');
                this.setState({
                    showFuelModal: false,
                    fuelUpdate: { vehicle_id: '', fuel_level: '' }
                });
                this.loadDashboard();
            } else {
                alert('Error: ' + res.message);
            }
        }).catch(err => console.error(err));
    }
    
    lockVehicle = (vehicleId) => {
        fetch(`${this.apiBase}/lockVehicle`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ vehicle_id: vehicleId, reason: 'MANUAL_LOCK' })
        }).then(r => r.json())
        .then(res => {
            if (res.status === 'success') {
                alert('Vehicle locked successfully!');
                this.loadDashboard();
            } else {
                alert('Error: ' + res.message);
            }
        }).catch(err => console.error(err));
    }
    
    unlockVehicle = (vehicleId) => {
        fetch(`${this.apiBase}/unlockVehicle`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ vehicle_id: vehicleId })
        }).then(r => r.json())
        .then(res => {
            if (res.status === 'success') {
                alert('Vehicle unlocked successfully!');
                this.loadDashboard();
            } else {
                alert('Error: ' + res.message);
            }
        }).catch(err => console.error(err));
    }
    
    render() {
        const { activeTab, stats, vehicleFuelStatus, alerts, loading, vehicles } = this.state;
        
        return (
            <div className="app-container">
                {/* Header */}
                <nav className="navbar navbar-dark bg-dark shadow">
                    <div className="container-fluid">
                        <span className="navbar-brand">🚗 Smart Vehicle Fuel Theft Detection</span>
                        <div className="text-white">
                            <small>Real-time Fuel Monitoring & Security</small>
                        </div>
                    </div>
                </nav>
                
                {/* Navigation Tabs */}
                <div className="nav-tabs-container bg-light border-bottom">
                    <div className="container-fluid">
                        <ul className="nav nav-tabs" role="tablist">
                            <li className="nav-item">
                                <a className={`nav-link ${activeTab === 'dashboard' ? 'active' : ''}`} 
                                   onClick={() => this.setState({ activeTab: 'dashboard' })}>
                                    📊 Dashboard
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className={`nav-link ${activeTab === 'vehicles' ? 'active' : ''}`} 
                                   onClick={() => this.setState({ activeTab: 'vehicles' })}>
                                    🚗 Vehicles
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className={`nav-link ${activeTab === 'alerts' ? 'active' : ''}`} 
                                   onClick={() => this.setState({ activeTab: 'alerts' })}>
                                    🚨 Alerts
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className={`nav-link ${activeTab === 'theft' ? 'active' : ''}`} 
                                   onClick={() => this.setState({ activeTab: 'theft' })}>
                                    ⚠️ Theft Events
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
                
                {/* Main Content */}
                <div className="container-fluid">
                    {loading && <div className="alert alert-info">Loading...</div>}
                    
                    {activeTab === 'dashboard' && this.renderDashboard()}
                    {activeTab === 'vehicles' && this.renderVehicles()}
                    {activeTab === 'alerts' && this.renderAlerts()}
                    {activeTab === 'theft' && this.renderTheftEvents()}
                </div>
                
                {/* Modals */}
                {this.renderModals()}
            </div>
        );
    }
    
    renderDashboard = () => {
        const { stats, vehicleFuelStatus, alerts } = this.state;
        
        return (
            <div className="dashboard-section">
                {/* Stats Cards */}
                <div className="row mb-4">
                    <div className="col-md-3 mb-3">
                        <div className="card bg-primary text-white h-100">
                            <div className="card-body">
                                <h5 className="card-title">🚗 Total Vehicles</h5>
                                <h2>{stats.total_vehicles || 0}</h2>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3 mb-3">
                        <div className="card bg-danger text-white h-100">
                            <div className="card-body">
                                <h5 className="card-title">🔒 Locked Vehicles</h5>
                                <h2>{stats.locked_vehicles || 0}</h2>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3 mb-3">
                        <div className="card bg-warning text-white h-100">
                            <div className="card-body">
                                <h5 className="card-title">⚠️ Theft Events</h5>
                                <h2>{stats.total_theft_events || 0}</h2>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3 mb-3">
                        <div className="card bg-info text-white h-100">
                            <div className="card-body">
                                <h5 className="card-title">📉 Total Fuel Loss</h5>
                                <h2>{stats.total_fuel_loss || 0}L</h2>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Vehicle Fuel Status */}
                <div className="row mb-4">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-header bg-dark text-white">
                                <h5>📊 Vehicle Fuel Status</h5>
                            </div>
                            <div className="card-body">
                                <div className="table-responsive">
                                    <table className="table table-hover">
                                        <thead className="table-dark">
                                            <tr>
                                                <th>Owner</th>
                                                <th>Registration</th>
                                                <th>Model</th>
                                                <th>Fuel Level</th>
                                                <th>Capacity</th>
                                                <th>%</th>
                                                <th>Status</th>
                                                <th>Thefts</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {vehicleFuelStatus.map(v => (
                                                <tr key={v.vehicle_id}>
                                                    <td><strong>{v.owner_name}</strong></td>
                                                    <td><span className="badge bg-info">{v.reg_number}</span></td>
                                                    <td>{v.model}</td>
                                                    <td><strong>{v.last_fuel_level}L</strong></td>
                                                    <td>{v.fuel_capacity}L</td>
                                                    <td>
                                                        <div className="d-flex align-items-center gap-2">
                                                            <div className="progress flex-grow-1" style={{ height: '25px', minWidth: '100px' }}>
                                                                <div 
                                                                    className="progress-bar bg-success d-flex align-items-center justify-content-center" 
                                                                    role="progressbar" 
                                                                    style={{ width: Math.max(v.fuel_percentage, 15) + '%', fontSize: '12px', fontWeight: 'bold' }}>
                                                                    {v.fuel_percentage.toFixed(1)}%
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        {v.is_locked ? 
                                                            <span className="badge bg-danger">🔒 LOCKED</span> :
                                                            <span className="badge bg-success">🔓 OPEN</span>
                                                        }
                                                    </td>
                                                    <td><span className="badge bg-warning">{v.theft_count}</span></td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Recent Alerts */}
                <div className="row">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-header bg-dark text-white">
                                <h5>🚨 Recent Alerts (Last 10)</h5>
                            </div>
                            <div className="card-body">
                                <div className="list-group">
                                    {alerts.slice(0, 10).length === 0 ? (
                                        <div className="alert alert-info mb-0">ℹ️ No recent alerts</div>
                                    ) : (
                                        alerts.slice(0, 10).map(alert => (
                                            <div key={alert.alert_id} className="list-group-item">
                                                <div className="d-flex w-100 justify-content-between align-items-start">
                                                    <div className="flex-grow-1">
                                                        <h6 className="mb-1">{alert.alert_message || `Alert #${alert.alert_id}`}</h6>
                                                        <small className="text-muted">Vehicle ID: {alert.vehicle_id}</small>
                                                    </div>
                                                    <small className="text-muted ms-2">
                                                        {alert.alert_time ? new Date(alert.alert_time).toLocaleString() : 'N/A'}
                                                    </small>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    
    renderVehicles = () => {
        const { vehicles } = this.state;
        
        return (
            <div className="vehicles-section">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h3>🚗 Vehicle Management</h3>
                    <button className="btn btn-primary" onClick={() => this.setState({ showAddVehicleModal: true })}>
                        ➕ Add New Vehicle
                    </button>
                </div>
                
                <div className="row">
                    {vehicles.map(v => (
                        <div key={v.vehicle_id} className="col-md-6 col-lg-4 mb-4">
                            <div className="card h-100 shadow-sm">
                                <div className="card-header bg-primary text-white">
                                    <h5 className="mb-0">{v.owner_name}</h5>
                                </div>
                                <div className="card-body">
                                    <p className="mb-2"><strong>📝 Registration:</strong> <span className="badge bg-info">{v.reg_number}</span></p>
                                    <p className="mb-2"><strong>🚙 Model:</strong> {v.model}</p>
                                    <p className="mb-2"><strong>⛽ Capacity:</strong> {v.fuel_capacity}L</p>
                                    <p className="mb-3"><strong>⛽ Current:</strong> {v.last_fuel_level}L</p>
                                    <div className="progress mb-3" style={{ height: '25px' }}>
                                        <div 
                                            className="progress-bar bg-warning" 
                                            role="progressbar" 
                                            style={{ width: ((v.last_fuel_level / v.fuel_capacity) * 100) + '%' }}>
                                            {((v.last_fuel_level / v.fuel_capacity) * 100).toFixed(1)}%
                                        </div>
                                    </div>
                                </div>
                                <div className="card-footer d-grid gap-2">
                                    <button className="btn btn-sm btn-info" 
                                            onClick={() => {
                                                this.loadVehicleDetails(v.vehicle_id);
                                                this.setState({ activeTab: 'alerts' });
                                            }}>
                                        📋 View Details
                                    </button>
                                    <button className="btn btn-sm btn-warning" 
                                            onClick={() => {
                                                this.setState({
                                                    showFuelModal: true,
                                                    fuelUpdate: { vehicle_id: v.vehicle_id.toString(), fuel_level: '' }
                                                });
                                            }}>
                                        ⛽ Update Fuel
                                    </button>
                                    {!v.is_locked ? (
                                        <button className="btn btn-sm btn-danger" onClick={() => this.lockVehicle(v.vehicle_id)}>
                                            🔒 Lock Vehicle
                                        </button>
                                    ) : (
                                        <button className="btn btn-sm btn-success" onClick={() => this.unlockVehicle(v.vehicle_id)}>
                                            🔓 Unlock Vehicle
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
    
    renderAlerts = () => {
        const { alerts } = this.state;
        
        return (
            <div className="alerts-section">
                <h3>🚨 System Alerts</h3>
                <div className="card">
                    <div className="card-body">
                        <div className="list-group">
                            {alerts.length === 0 ? (
                                <div className="alert alert-success">✅ No alerts at this time</div>
                            ) : (
                                alerts.map(alert => (
                                    <div key={alert.alert_id} className="list-group-item border-start border-4 border-danger">
                                        <div className="d-flex w-100 justify-content-between align-items-start">
                                            <div className="flex-grow-1">
                                                <h6 className="mb-1">{alert.alert_message || `Alert on Vehicle ${alert.vehicle_id}`}</h6>
                                                <small className="text-muted">Vehicle ID: {alert.vehicle_id} | {alert.alert_time ? new Date(alert.alert_time).toLocaleString() : 'N/A'}</small>
                                            </div>
                                            <span className="badge bg-danger ms-2">ACTIVE</span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    
    renderTheftEvents = () => {
        const { theftEvents } = this.state;
        
        return (
            <div className="theft-section">
                <h3>⚠️ Fuel Theft Events</h3>
                {!theftEvents || theftEvents.length === 0 ? (
                    <div className="alert alert-success">✅ No theft events recorded</div>
                ) : (
                    <div className="table-responsive">
                        <table className="table table-striped table-hover">
                            <thead className="table-dark">
                                <tr>
                                    <th>Event ID</th>
                                    <th>Vehicle ID</th>
                                    <th>Previous Level</th>
                                    <th>Current Level</th>
                                    <th>Fuel Loss</th>
                                    <th>Detected At</th>
                                </tr>
                            </thead>
                            <tbody>
                                {theftEvents.map(event => (
                                    <tr key={event.event_id} className="table-danger">
                                        <td>{event.event_id}</td>
                                        <td><span className="badge bg-warning">{event.vehicle_id}</span></td>
                                        <td>{event.previous_level || event.old_fuel_level || 'N/A'}L</td>
                                        <td>{event.current_level || event.new_fuel_level || 'N/A'}L</td>
                                        <td><strong className="text-danger">{event.fuel_loss || event.fuel_decrease || 'N/A'}L</strong></td>
                                        <td>{event.theft_detected_at || event.created_at ? new Date(event.theft_detected_at || event.created_at).toLocaleString() : 'N/A'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        );
    }
    
    renderModals = () => {
        const { showAddVehicleModal, newVehicle, showFuelModal, fuelUpdate, vehicles } = this.state;
        
        return (
            <>
                {/* Add Vehicle Modal */}
                {showAddVehicleModal && (
                    <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header bg-dark text-white">
                                    <h5 className="modal-title">➕ Add New Vehicle</h5>
                                    <button type="button" className="btn-close btn-close-white" 
                                            onClick={() => this.setState({ showAddVehicleModal: false })}></button>
                                </div>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label className="form-label">Owner Name *</label>
                                        <input type="text" className="form-control" 
                                               value={newVehicle.owner_name}
                                               onChange={e => this.setState({ newVehicle: {...newVehicle, owner_name: e.target.value} })} />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Registration Number *</label>
                                        <input type="text" className="form-control" 
                                               value={newVehicle.reg_number}
                                               onChange={e => this.setState({ newVehicle: {...newVehicle, reg_number: e.target.value} })} />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Model</label>
                                        <input type="text" className="form-control" 
                                               value={newVehicle.model}
                                               onChange={e => this.setState({ newVehicle: {...newVehicle, model: e.target.value} })} />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Fuel Capacity (Liters) *</label>
                                        <input type="number" className="form-control" 
                                               value={newVehicle.fuel_capacity}
                                               onChange={e => this.setState({ newVehicle: {...newVehicle, fuel_capacity: e.target.value} })} />
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" 
                                            onClick={() => this.setState({ showAddVehicleModal: false })}>Cancel</button>
                                    <button type="button" className="btn btn-primary" onClick={this.addVehicle}>Add Vehicle</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                
                {/* Update Fuel Modal */}
                {showFuelModal && (
                    <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header bg-dark text-white">
                                    <h5 className="modal-title">⛽ Update Fuel Level</h5>
                                    <button type="button" className="btn-close btn-close-white" 
                                            onClick={() => this.setState({ showFuelModal: false })}></button>
                                </div>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label className="form-label">Select Vehicle *</label>
                                        <select className="form-control" 
                                                value={fuelUpdate.vehicle_id}
                                                onChange={e => this.setState({ fuelUpdate: {...fuelUpdate, vehicle_id: e.target.value} })}>
                                            <option value="">-- Select Vehicle --</option>
                                            {vehicles.map(v => (
                                                <option key={v.vehicle_id} value={v.vehicle_id}>
                                                    {v.owner_name} ({v.reg_number})
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">New Fuel Level (Liters) *</label>
                                        <input type="number" className="form-control" 
                                               value={fuelUpdate.fuel_level}
                                               onChange={e => this.setState({ fuelUpdate: {...fuelUpdate, fuel_level: e.target.value} })} />
                                    </div>
                                    <div className="alert alert-warning">
                                        <small><strong>⚠️ Note:</strong> If fuel level suddenly drops, the system will automatically detect theft and lock the vehicle!</small>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" 
                                            onClick={() => this.setState({ showFuelModal: false })}>Cancel</button>
                                    <button type="button" className="btn btn-warning" onClick={this.updateFuelLevel}>Update Fuel</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </>
        );
    }
}

// Render the app
ReactDOM.render(<SmartFuelTheftApp />, document.getElementById('app'));
