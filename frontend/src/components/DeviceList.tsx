import React from 'react';
import { IoTDevice } from '../types/IoTDevice';
import './DeviceList.css';

interface DeviceListProps {
  devices: IoTDevice[];
  loading: boolean;
  error: string | null;
  onToggleDevice: (deviceId: number) => Promise<void>;
}

const DeviceList: React.FC<DeviceListProps> = ({
  devices,
  loading,
  error,
  onToggleDevice
}) => {
  if (loading) {
    return (
      <div className="device-list">
        <div className="loading">Loading devices...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="device-list">
        <div className="error">Error: {error}</div>
      </div>
    );
  }

  if (devices.length === 0) {
    return (
      <div className="device-list">
        <div className="no-devices">No devices found</div>
      </div>
    );
  }

  return (
    <div className="device-list">
      <h2>IoT Devices</h2>
      <ul className="devices">
        {devices.map((device) => (
          <li key={device.id} className="device-item">
            <div className="device-info">
              <span className="device-name">{device.name}</span>
              <span className={`device-status ${device.isOn ? 'on' : 'off'}`}>
                {device.isOn ? 'ON' : 'OFF'}
              </span>
            </div>
            <button
              className={`toggle-btn ${device.isOn ? 'turn-off' : 'turn-on'}`}
              onClick={() => onToggleDevice(device.id)}
            >
              Turn {device.isOn ? 'OFF' : 'ON'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DeviceList;