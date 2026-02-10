# Real-Time Notifications Setup with Socket.io

## 1. Install Dependencies

```bash
npm install socket.io-client
```

## 2. Create Socket.io Service

See `src/lib/socketService.js` for the complete implementation.

The service handles:
- Connection management
- Event listeners for notifications
- Disconnect handling
- Reconnection logic

## 3. Environment Variables

Add to `.env`:

```env
VITE_SOCKET_URL=http://localhost:3001
```

For production, use your deployed backend URL.

## 4. Usage in Components

### In a React Component

```javascript
import { useSocket } from '../hooks/useSocket';

function MyComponent() {
  const { socket, notifications, markAsRead } = useSocket();

  useEffect(() => {
    // Listen for incoming notifications
    socket?.on('notification', (data) => {
      console.log('New notification:', data);
    });

    return () => {
      socket?.off('notification');
    };
  }, [socket]);

  return (
    // Your component JSX
  );
}
```

## 5. Notification Types

### Blood Request Match
- Triggered when user's blood group matches a new request
- Contains: patient name, blood group, location, urgency, hospital

### Donor Availability Update
- Triggered when a donor comes online or goes offline
- Contains: donor name, blood group, city, status

### Hospital Alert
- Triggered when nearby hospital needs specific blood type
- Contains: hospital name, blood type needed, quantity, urgency

## 6. Backend Setup (Node.js Express with Socket.io)

```javascript
// backend/server.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

app.use(cors());

// Store connected users
const connectedUsers = new Map();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // User subscribes to blood group notifications
  socket.on('subscribe_blood_group', (bloodGroup, userId) => {
    const room = `blood_${bloodGroup}`;
    socket.join(room);
    connectedUsers.set(userId, { socketId: socket.id, bloodGroup });
  });

  // Emit blood request to all donors of matching blood group
  socket.on('new_blood_request', (requestData) => {
    const room = `blood_${requestData.bloodGroup}`;
    io.to(room).emit('blood_request_alert', requestData);
  });

  // Donor status update
  socket.on('donor_status_change', (status) => {
    io.emit('donor_status_update', status);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    // Remove from connectedUsers
    for (const [userId, data] of connectedUsers) {
      if (data.socketId === socket.id) {
        connectedUsers.delete(userId);
      }
    }
  });
});

server.listen(3001, () => {
  console.log('Socket.io server running on :3001');
});
```

## 7. Integration Points

- **Donate Page**: Send blood requests to notify matching donors
- **Find Page**: Receive real-time updates on donor availability
- **Profile Page**: Get alerts for matching blood requests
- **Hospitals Page**: Receive urgent blood bank requests

## 8. Testing

Use Socket.io test client:

```bash
npm install -g socket.io-client-cli
# Then connect and test events
```

Or create a test component that emits and listens to events.
