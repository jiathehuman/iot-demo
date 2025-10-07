namespace IoTDeviceAPI.Models
{
    public class BatchToggleResult
    {
        public bool Success { get; set; }
        public int DevicesAffected { get; set; }
        public int TotalDevices { get; set; }
        public string Message { get; set; } = string.Empty;
        public List<string> Errors { get; set; } = new List<string>();
    }
}