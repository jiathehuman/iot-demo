import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { IoTDevice, DeviceType, BatchToggleRequest, BatchToggleResult } from '../types/IoTDevice';

const API_BASE_URL = 'http://localhost:5100';
const SIGNALR_HUB_URL = `${API_BASE_URL}/deviceHub`;

export class DeviceService {
  private hubConnection: HubConnection | null = null;

  constructor() {
    this.initializeSignalRConnection();
  }

  private initializeSignalRConnection(): void {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(SIGNALR_HUB_URL)
      .configureLogging(LogLevel.Information)
      .build();
  }

  public async startConnection(): Promise<void> {
    if (this.hubConnection && this.hubConnection.state === 'Disconnected') {
      try {
        await this.hubConnection.start();
        console.log('SignalR connection started');
      } catch (error) {
        console.error('Error starting SignalR connection:', error);
        throw error;
      }
    }
  }

  public async stopConnection(): Promise<void> {
    if (this.hubConnection) {
      try {
        await this.hubConnection.stop();
        console.log('SignalR connection stopped');
      } catch (error) {
        console.error('Error stopping SignalR connection:', error);
      }
    }
  }

  public onDeviceStateChanged(callback: (device: IoTDevice) => void): void {
    if (this.hubConnection) {
      this.hubConnection.on('DeviceStateChanged', callback);
    }
  }

  public offDeviceStateChanged(): void {
    if (this.hubConnection) {
      this.hubConnection.off('DeviceStateChanged');
    }
  }

  public async getAllDevices(): Promise<IoTDevice[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/devices`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching devices:', error);
      throw error;
    }
  }

  public async getDevicesByType(deviceType: DeviceType): Promise<IoTDevice[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/devices?type=${deviceType}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching devices by type:', error);
      throw error;
    }
  }

  public async toggleDevice(deviceId: number): Promise<IoTDevice> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/devices/${deviceId}/toggle`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error toggling device:', error);
      throw error;
    }
  }

  public async batchToggleDevices(request: BatchToggleRequest): Promise<BatchToggleResult> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/devices/batch-toggle`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error batch toggling devices:', error);
      throw error;
    }
  }
}