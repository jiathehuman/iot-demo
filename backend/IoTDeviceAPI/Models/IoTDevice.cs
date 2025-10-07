namespace IoTDeviceAPI.Models
{
    public class IoTDevice
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public bool IsOn { get; set; }
        public DeviceType DeviceType { get; set; }
    }
}