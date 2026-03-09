import { io } from "socket.io-client";

let socket = null;

/**
 * Initialize Socket.io connection
 */
export const initializeSocket = () => {
  if (socket) return socket;

  const socketUrl = import.meta.env.VITE_SOCKET_URL || "http://localhost:3001";

  socket = io(socketUrl, {
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5,
    transports: ["websocket", "polling"],
  });

  socket.on("connect", () => {
    console.log("Socket.io connected:", socket.id);
  });

  socket.on("disconnect", () => {
    console.log("Socket.io disconnected");
  });

  socket.on("error", (error) => {
    console.error("Socket.io error:", error);
  });

  return socket;
};

/**
 * Get current socket instance
 */
export const getSocket = () => {
  if (!socket) {
    return initializeSocket();
  }
  return socket;
};

/**
 * Disconnect socket
 */
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

/**
 * Subscribe to blood group notifications
 */
export const subscribeToBloodGroup = (bloodGroup, userId) => {
  const socketInstance = getSocket();
  socketInstance.emit("subscribe_blood_group", bloodGroup, userId);
};

/**
 * Emit blood request
 */
export const emitBloodRequest = (requestData) => {
  const socketInstance = getSocket();
  socketInstance.emit("new_blood_request", requestData);
};

/**
 * Update donor status
 */
export const emitDonorStatusChange = (statusData) => {
  const socketInstance = getSocket();
  socketInstance.emit("donor_status_change", statusData);
};

/**
 * Listen to blood request alerts
 */
export const onBloodRequestAlert = (callback) => {
  const socketInstance = getSocket();
  socketInstance.on("blood_request_alert", callback);
};

/**
 * Listen to donor status updates
 */
export const onDonorStatusUpdate = (callback) => {
  const socketInstance = getSocket();
  socketInstance.on("donor_status_update", callback);
};

/**
 * Remove event listeners
 */
export const removeListener = (event) => {
  const socketInstance = getSocket();
  socketInstance.off(event);
};

/**
 * Check if socket is connected
 */
export const isSocketConnected = () => {
  return socket ? socket.connected : false;
};
