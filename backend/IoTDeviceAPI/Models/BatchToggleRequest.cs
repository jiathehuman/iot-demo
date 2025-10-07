namespace IoTDeviceAPI.Models
{
    public class BatchToggleRequest
    {
        public DeviceType DeviceType { get; set; }
        public bool State { get; set; }
    }
}