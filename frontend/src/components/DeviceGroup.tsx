import React from 'react';
import { IoTDevice, DeviceType, BatchToggleRequest } from '../types/IoTDevice';
import './DeviceGroup.css';

interface DeviceGroupProps {
  title: string;
  deviceType: DeviceType;
  devices: IoTDevice[];
  onToggleDevice: (deviceId: number) => Promise<void>;
  onBatchToggle: (request: BatchToggleRequest) => Promise<void>;
}

const DeviceGroup: React.FC<DeviceGroupProps> = ({
  title,
  deviceType,
  devices,
  onToggleDevice,
  onBatchToggle
}) => {
  const handleTurnAllOn = () => {
    onBatchToggle({ deviceType: deviceType, state: true });
  };

  const handleTurnAllOff = () => {
    onBatchToggle({ deviceType: deviceType, state: false });
  };

  const getDeviceIcon = (type: DeviceType) => {
    return type === DeviceType.Lightbulb ? 'Light' : 'AC';
  };

  if (devices.length === 0) {
    return (
      <div className="device-group">
        <h3 className="group-title">
          {getDeviceIcon(deviceType)} {title}
        </h3>
        <div className="no-devices-in-group">No devices in this group</div>
      </div>
    );
  }

  return (
    <div className="device-group">
      <div className="group-header">
        <h3 className="group-title">
          {getDeviceIcon(deviceType)} {title}
        </h3>
        <div className="group-controls">
          <button
            className="group-btn turn-all-on"
            onClick={handleTurnAllOn}
          >
            Turn All ON
          </button>
          <button
            className="group-btn turn-all-off"
            onClick={handleTurnAllOff}
          >
            Turn All OFF
          </button>
        </div>
      </div>

      <ul className="group-devices">
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

export default DeviceGroup;