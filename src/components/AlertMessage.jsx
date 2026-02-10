import React from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';

/**
 * Reusable AlertMessage component
 * Displays success, error, or warning messages with icons
 * Provides consistent styling and accessibility
 */
function AlertMessage({ type = 'info', message, onClose = null }) {
  if (!message) return null;

  const styles = {
    error: {
      container: 'bg-red-50 border border-red-200',
      text: 'text-red-700',
      icon: 'text-red-600',
    },
    success: {
      container: 'bg-green-50 border border-green-200',
      text: 'text-green-700',
      icon: 'text-green-600',
    },
    warning: {
      container: 'bg-yellow-50 border border-yellow-200',
      text: 'text-yellow-700',
      icon: 'text-yellow-600',
    },
    info: {
      container: 'bg-blue-50 border border-blue-200',
      text: 'text-blue-700',
      icon: 'text-blue-600',
    },
  };

  const style = styles[type] || styles.info;
  const Icon = type === 'success' ? CheckCircle : AlertCircle;

  return (
    <div
      role="alert"
      className={`${style.container} ${style.text} p-4 rounded flex items-center gap-3 mb-4`}
    >
      <Icon className={`${style.icon} flex-shrink-0`} size={20} />
      <span className="flex-1">{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          aria-label="Close alert"
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      )}
    </div>
  );
}

export default AlertMessage;
