## Start backend server
```bash
dotnet run --project /Users/main/Desktop/test-app/backend/IoTDeviceAPI/IoTDeviceAPI.csproj
```

## Start frontend
```bash
npm install
npm start
```

## Testing the API
```bash
curl -s http://localhost:5100/api/devices
```

# Endpoints
GET /api/devices retrieves all devices or filters using query parameter
?type=lightbulb or ?type=airconditioner
`curl http://localhost:5100/api/devices`

Only lightbulbs
curl "http://localhost:5100/api/devices?type=lightbulb"

Only aircons
curl "http://localhost:5100/api/devices?type=airconditioner"


POST /api/devices/{id}/toggle to toggle device by its ID
curl -X POST http://localhost:5100/api/devices/1/toggle



POST /api/devices/batch-toggle to toggle all devices of a specific type using request body
`{"deviceType": 0, "state": true}`.

Turn all lightbulbs ON
curl -X POST http://localhost:5100/api/devices/batch-toggle \
  -H "Content-Type: application/json" \
  -d '{"deviceType": 0, "state": true}'


Turn all air conditioners OFF
curl -X POST http://localhost:5100/api/devices/batch-toggle \
  -H "Content-Type: application/json" \
  -d '{"deviceType": 1, "state": false}'


SignalIR Hub: /deviceHub
Real-time WebSocket connection that broadcasts DeviceStateChanged events to connected clients when state changes