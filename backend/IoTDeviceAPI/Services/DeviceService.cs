using IoTDeviceAPI.Models;

namespace IoTDeviceAPI.Services
{
    public class DeviceService
    {
        private readonly List<IoTDevice> _devices;

        public DeviceService()
        {
            // Pre-populate with 2 lightbulbs and 2 air conditioners
            _devices = new List<IoTDevice>
            {
                new IoTDevice { Id = 1, Name = "Light1", IsOn = false, DeviceType = DeviceType.Lightbulb },
                new IoTDevice { Id = 2, Name = "Light2", IsOn = false, DeviceType = DeviceType.Lightbulb },
                new IoTDevice { Id = 3, Name = "AirCon1", IsOn = false, DeviceType = DeviceType.AirConditioner },
                new IoTDevice { Id = 4, Name = "AirCon2", IsOn = false, DeviceType = DeviceType.AirConditioner }
            };
        }

        public List<IoTDevice> GetAllDevices()
        {
            return _devices;
        }

        public List<IoTDevice> GetDevicesByType(DeviceType deviceType)
        {
            return _devices.Where(d => d.DeviceType == deviceType).ToList();
        }

        public IoTDevice? GetDevice(int id)
        {
            return _devices.FirstOrDefault(d => d.Id == id);
        }

        public bool ToggleDevice(int id)
        {
            var device = GetDevice(id);
            if (device != null)
            {
                device.IsOn = !device.IsOn;
                return true;
            }
            return false;
        }

        public BatchToggleResult BatchToggleDevices(DeviceType deviceType, bool state)
        {
            var devicesOfType = GetDevicesByType(deviceType);
            var result = new BatchToggleResult
            {
                TotalDevices = devicesOfType.Count
            };

            int successCount = 0;
            var errors = new List<string>();

            foreach (var device in devicesOfType)
            {
                try
                {
                    device.IsOn = state;
                    successCount++;
                }
                catch (Exception ex)
                {
                    errors.Add($"Failed to toggle device {device.Name}: {ex.Message}");
                }
            }

            result.DevicesAffected = successCount;
            result.Success = successCount > 0;
            result.Errors = errors;
            result.Message = result.Success
                ? $"Successfully toggled {successCount} of {result.TotalDevices} {deviceType} devices"
                : "Failed to toggle any devices";

            return result;
        }

        public List<IoTDevice> GetUpdatedDevices(DeviceType deviceType)
        {
            return GetDevicesByType(deviceType);
        }
    }
}