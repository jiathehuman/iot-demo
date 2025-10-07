export enum DeviceType {
  Lightbulb = 0,
  AirConditioner = 1
}

export interface IoTDevice {
  id: number;
  name: string;
  isOn: boolean;
  deviceType: DeviceType;
}

export interface BatchToggleRequest {
  deviceType: DeviceType;
  state: boolean;
}

export interface BatchToggleResult {
  success: boolean;
  devicesAffected: number;
  totalDevices: number;
  message: string;
  errors: string[];
}