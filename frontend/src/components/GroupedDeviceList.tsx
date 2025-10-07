import React from 'react';
import { IoTDevice, DeviceType, BatchToggleRequest } from '../types/IoTDevice';
import DeviceGroup from './DeviceGroup';
import './GroupedDeviceList.css';

interface GroupedDeviceListProps {
  devices: IoTDevice[];
  loading: boolean;
  error: string | null;
  onToggleDevice: (deviceId: number) => Promise<void>;
  onBatchToggle: (request: BatchToggleRequest) => Promise<void>;
}

const GroupedDeviceList: React.FC<GroupedDeviceListProps> = ({
  devices,
  loading,
  error,
  onToggleDevice,
  onBatchToggle
}) => {
  if (loading) {
    return (
      <div className="grouped-device-list">
        <div className="loading">Loading devices...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="grouped-device-list">
        <div className="error">Error: {error}</div>
      </div>
    );
  }

  // Group devices by type
  const lightbulbs = devices.filter(device => device.deviceType === DeviceType.Lightbulb);
  const airConditioners = devices.filter(device => device.deviceType === DeviceType.AirConditioner);

  if (devices.length === 0) {
    return (
      <div className="grouped-device-list">
        <div className="no-devices">No devices found</div>
      </div>
    );
  }

  return (
    <div className="grouped-device-list">
      <h2>IoT Device Groups</h2>

      <DeviceGroup
        title="Lighting"
        deviceType={DeviceType.Lightbulb}
        devices={lightbulbs}
        onToggleDevice={onToggleDevice}
        onBatchToggle={onBatchToggle}
      />

      <DeviceGroup
        title="Air Conditioning"
        deviceType={DeviceType.AirConditioner}
        devices={airConditioners}
        onToggleDevice={onToggleDevice}
        onBatchToggle={onBatchToggle}
      />
    </div>
  );
};

export default GroupedDeviceList;