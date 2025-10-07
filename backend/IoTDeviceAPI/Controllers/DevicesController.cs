using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using IoTDeviceAPI.Models;
using IoTDeviceAPI.Services;
using IoTDeviceAPI.Hubs;

namespace IoTDeviceAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DevicesController : ControllerBase
    {
        private readonly DeviceService _deviceService;
        private readonly IHubContext<DeviceHub> _hubContext;

        public DevicesController(DeviceService deviceService, IHubContext<DeviceHub> hubContext)
        {
            _deviceService = deviceService;
            _hubContext = hubContext;
        }

        [HttpGet]
        public ActionResult<List<IoTDevice>> GetAllDevices([FromQuery] DeviceType? type = null)
        {
            try
            {
                var devices = type.HasValue
                    ? _deviceService.GetDevicesByType(type.Value)
                    : _deviceService.GetAllDevices();
                return Ok(devices);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("{id}")]
        public ActionResult<IoTDevice> GetDevice(int id)
        {
            try
            {
                var device = _deviceService.GetDevice(id);
                if (device == null)
                {
                    return NotFound($"Device with ID {id} not found");
                }
                return Ok(device);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPost("{id}/toggle")]
        public async Task<ActionResult<IoTDevice>> ToggleDevice(int id)
        {
            try
            {
                var success = _deviceService.ToggleDevice(id);
                if (!success)
                {
                    return NotFound($"Device with ID {id} not found");
                }

                var updatedDevice = _deviceService.GetDevice(id);

                // Broadcast the update to all connected clients
                await _hubContext.Clients.All.SendAsync("DeviceStateChanged", updatedDevice);

                return Ok(updatedDevice);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPost("batch-toggle")]
        public async Task<ActionResult<BatchToggleResult>> BatchToggleDevices([FromBody] BatchToggleRequest request)
        {
            try
            {
                var result = _deviceService.BatchToggleDevices(request.DeviceType, request.State);

                if (result.Success)
                {
                    // Get all updated devices of this type and broadcast individual events
                    var updatedDevices = _deviceService.GetUpdatedDevices(request.DeviceType);
                    foreach (var device in updatedDevices)
                    {
                        await _hubContext.Clients.All.SendAsync("DeviceStateChanged", device);
                    }
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}