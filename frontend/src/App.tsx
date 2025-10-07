import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import GroupedDeviceList from './components/GroupedDeviceList';
import { IoTDevice, BatchToggleRequest } from './types/IoTDevice';
import { DeviceService } from './services/DeviceService';

function App() {
  const [devices, setDevices] = useState<IoTDevice[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<string>('Disconnected');
  const [deviceService] = useState(() => new DeviceService());

  const loadDevices = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedDevices = await deviceService.getAllDevices();
      setDevices(fetchedDevices);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load devices');
    } finally {
      setLoading(false);
    }
  }, [deviceService]);

  const handleToggleDevice = useCallback(async (deviceId: number) => {
    try {
      setError(null);
      await deviceService.toggleDevice(deviceId);
      // Device state will be updated via SignalR callback
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to toggle device');
    }
  }, [deviceService]);

  const handleBatchToggle = useCallback(async (request: BatchToggleRequest) => {
    try {
      setError(null);
      const result = await deviceService.batchToggleDevices(request);
      if (!result.success) {
        setError(`Batch operation partially failed: ${result.message}`);
      }
      // Device states will be updated via SignalR callbacks
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to perform batch operation');
    }
  }, [deviceService]);

  const handleDeviceStateChanged = useCallback((updatedDevice: IoTDevice) => {
    setDevices(prevDevices =>
      prevDevices.map(device =>
        device.id === updatedDevice.id ? updatedDevice : device
      )
    );
  }, []);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Load initial devices
        await loadDevices();

        // Setup SignalR connection
        deviceService.onDeviceStateChanged(handleDeviceStateChanged);
        await deviceService.startConnection();
        setConnectionStatus('Connected');
      } catch (err) {
        setError('Failed to initialize connection');
        setConnectionStatus('Connection Failed');
      }
    };

    initializeApp();

    // Cleanup on unmount
    return () => {
      deviceService.offDeviceStateChanged();
      deviceService.stopConnection();
    };
  }, [deviceService, loadDevices, handleDeviceStateChanged]);

  return (
    <div className="App">
      <header className="App-header">
        <h1>IoT Device Manager</h1>
        <div className={`connection-status ${connectionStatus.toLowerCase().replace(' ', '-')}`}>
          SignalR: {connectionStatus}
        </div>
      </header>
      <main className="App-main">
        <GroupedDeviceList
          devices={devices}
          loading={loading}
          error={error}
          onToggleDevice={handleToggleDevice}
          onBatchToggle={handleBatchToggle}
        />
      </main>
    </div>
  );
}

export default App;
