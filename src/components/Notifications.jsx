import React from "react";
import { Bell, X, CheckCircle, AlertCircle } from "lucide-react";

/**
 * NotificationBell - Displays unread notification count in header
 */
export function NotificationBell({ unreadCount, onClick }) {
  return (
    <button
      onClick={onClick}
      className="relative p-2 text-gray-600 hover:text-red-600 transition-colors"
      aria-label="Notifications"
    >
      <Bell size={24} />
      {unreadCount > 0 && (
        <span className="absolute top-0 right-0 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
          {unreadCount > 9 ? "9+" : unreadCount}
        </span>
      )}
    </button>
  );
}

/**
 * NotificationPanel - Displays notification list in a dropdown/modal
 */
export function NotificationPanel({
  notifications,
  onClose,
  onMarkAsRead,
  onClear,
  isOpen,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-xl z-50 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">Notifications</h2>
          <button onClick={onClose} className="hover:bg-red-700 p-1 rounded">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <Bell size={48} className="mb-4 text-gray-300" />
              <p>No notifications yet</p>
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={onMarkAsRead}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="border-t p-4">
            <button
              onClick={onClear}
              className="w-full bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium"
            >
              Clear All
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * NotificationItem - Individual notification display
 */
function NotificationItem({ notification, onMarkAsRead }) {
  const { type, title, message, read, timestamp, id } = notification;

  const getIcon = () => {
    switch (type) {
      case "blood_request":
        return <AlertCircle className="text-red-600" size={20} />;
      case "donor_status":
        return <CheckCircle className="text-green-600" size={20} />;
      default:
        return <Bell className="text-blue-600" size={20} />;
    }
  };

  const getBackgroundColor = () => {
    if (read) return "bg-gray-50";
    switch (type) {
      case "blood_request":
        return "bg-red-50";
      case "donor_status":
        return "bg-green-50";
      default:
        return "bg-blue-50";
    }
  };

  return (
    <div
      className={`p-4 hover:bg-gray-100 transition-colors cursor-pointer ${getBackgroundColor()}`}
      onClick={() => !read && onMarkAsRead(id)}
    >
      <div className="flex gap-3">
        <div className="flex-shrink-0 mt-1">{getIcon()}</div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
            {!read && (
              <span className="ml-2 inline-block w-2 h-2 bg-red-600 rounded-full flex-shrink-0"></span>
            )}
          </div>
          <p className="text-sm text-gray-600 mt-1">{message}</p>
          <p className="text-xs text-gray-500 mt-2">
            {formatTime(timestamp)}
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * NotificationToast - Toast notification for new alerts
 */
export function NotificationToast({ notification, onClose }) {
  React.useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const getBgColor = () => {
    switch (notification.type) {
      case "blood_request":
        return "bg-red-600";
      case "donor_status":
        return "bg-green-600";
      default:
        return "bg-blue-600";
    }
  };

  return (
    <div
      className={`fixed bottom-4 right-4 ${getBgColor()} text-white rounded-lg shadow-lg p-4 max-w-sm flex items-start gap-3 animate-pulse z-40`}
    >
      <div className="flex-shrink-0 mt-0.5">{getIcon(notification.type)}</div>
      <div className="flex-1">
        <h4 className="font-semibold">{notification.title}</h4>
        <p className="text-sm text-opacity-90">{notification.message}</p>
      </div>
      <button
        onClick={onClose}
        className="flex-shrink-0 text-opacity-75 hover:text-opacity-100"
      >
        <X size={18} />
      </button>
    </div>
  );
}

function getIcon(type) {
  switch (type) {
    case "blood_request":
      return <AlertCircle size={20} />;
    case "donor_status":
      return <CheckCircle size={20} />;
    default:
      return <Bell size={20} />;
  }
}

function formatTime(timestamp) {
  const now = new Date();
  const notifTime = new Date(timestamp);
  const diffMs = now - notifTime;
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;

  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}
