using IoTDeviceAPI.Services;
using IoTDeviceAPI.Hubs;

// Create the web application builder with command line arguments
var builder = WebApplication.CreateBuilder(args);

// Add services to the dependency injection container
// Controllers provide REST API endpoints for HTTP requests
builder.Services.AddControllers();

// SignalR enables real-time bidirectional communication between server and clients
// Used for broadcasting device state changes to all connected frontend clients
builder.Services.AddSignalR();

// Register DeviceService as singleton to maintain device state in memory across requests
// Singleton pattern ensures all controllers share the same device instances
builder.Services.AddSingleton<DeviceService>();

// Configure Cross-Origin Resource Sharing to allow React frontend communication
// Required because frontend (port 3000) and backend (port 5100) run on different origins
builder.Services.AddCors(options =>
{
    options.AddPolicy("ReactApp", policy =>
    {
        // Allow requests from React development server
        policy.WithOrigins("http://localhost:3000")
              // Allow any HTTP headers in requests
              .AllowAnyHeader()
              // Allow any HTTP methods (GET, POST, etc.)
              .AllowAnyMethod()
              // Enable credentials for SignalR WebSocket connections
              .AllowCredentials();
    });
});

// Add OpenAPI support for API documentation and testing
builder.Services.AddOpenApi();

// Build the configured web application
var app = builder.Build();

// Configure the HTTP request pipeline for development environment
if (app.Environment.IsDevelopment())
{
    // Enable OpenAPI endpoint for API documentation
    app.MapOpenApi();
}

// Force HTTPS redirection for security
app.UseHttpsRedirection();

// Apply CORS policy to enable frontend communication
app.UseCors("ReactApp");

// Map API controllers to handle HTTP requests at /api/* endpoints
app.MapControllers();

// Map SignalR hub for real-time WebSocket connections
// Clients connect to /deviceHub to receive live device state updates
app.MapHub<DeviceHub>("/deviceHub");

// Start the web server and begin listening for requests
app.Run();
