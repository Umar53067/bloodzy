import { useEffect, useState, useCallback } from "react";
import {
  initializeSocket,
  getSocket,
  subscribeToBloodGroup,
  onBloodRequestAlert,
  onDonorStatusUpdate,
  removeListener,
  isSocketConnected,
} from "../lib/socketService";

/**
 * Custom hook for Socket.io functionality
 */
export const useSocket = () => {
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [connected, setConnected] = useState(false);

  // Initialize socket connection
  useEffect(() => {
    const socketInstance = initializeSocket();
    setSocket(socketInstance);

    socketInstance.on("connect", () => {
      setConnected(true);
      console.log("Socket connected:", socketInstance.id);
    });

    socketInstance.on("disconnect", () => {
      setConnected(false);
      console.log("Socket disconnected");
    });

    // Listen for blood request alerts
    const handleBloodRequestAlert = (data) => {
      const notification = {
        id: Date.now(),
        type: "blood_request",
        title: "Blood Request Alert",
        message: `Patient ${data.patient_name} needs ${data.blood_group} blood type`,
        data: data,
        timestamp: new Date(),
        read: false,
      };
      setNotifications((prev) => [notification, ...prev]);
    };

    // Listen for donor status updates
    const handleDonorStatusUpdate = (data) => {
      const notification = {
        id: Date.now(),
        type: "donor_status",
        title: "Donor Status Update",
        message: `${data.donor_name} is now ${data.status === "online" ? "online" : "offline"}`,
        data: data,
        timestamp: new Date(),
        read: false,
      };
      setNotifications((prev) => [notification, ...prev]);
    };

    socketInstance.on("blood_request_alert", handleBloodRequestAlert);
    socketInstance.on("donor_status_update", handleDonorStatusUpdate);

    return () => {
      socketInstance.off("blood_request_alert");
      socketInstance.off("donor_status_update");
    };
  }, []);

  // Subscribe to blood group
  const subscribeToGroup = useCallback(
    (bloodGroup, userId) => {
      if (socket) {
        subscribeToBloodGroup(bloodGroup, userId);
      }
    },
    [socket]
  );

  // Mark notification as read
  const markAsRead = useCallback((notificationId) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
  }, []);

  // Clear all notifications
  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Get unread notification count
  const unreadCount = notifications.filter((n) => !n.read).length;

  return {
    socket,
    notifications,
    connected,
    subscribeToGroup,
    markAsRead,
    clearNotifications,
    unreadCount,
  };
};

export default useSocket;
