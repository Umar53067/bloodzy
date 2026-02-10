import React from 'react';
import { AlertCircle, Search, Heart, MapPin } from 'lucide-react';

/**
 * EmptyState component
 * Displays an attractive empty state with icon, message, and optional CTA
 * 
 * @param {Object} props
 * @param {string} props.icon - Icon type: 'search', 'heart', 'location', 'alert'
 * @param {string} props.title - Main heading
 * @param {string} props.message - Description text
 * @param {string} props.actionText - Optional button text
 * @param {function} props.onAction - Optional button click handler
 * @param {string} props.className - Additional CSS classes
 */
function EmptyState({
  icon = 'search',
  title = 'No Results Found',
  message = 'Try adjusting your filters or search criteria.',
  actionText = null,
  onAction = null,
  className = ''
}) {
  const getIcon = () => {
    switch (icon) {
      case 'heart':
        return <Heart className="h-16 w-16 text-red-500" />;
      case 'location':
        return <MapPin className="h-16 w-16 text-blue-500" />;
      case 'alert':
        return <AlertCircle className="h-16 w-16 text-yellow-500" />;
      default:
        return <Search className="h-16 w-16 text-gray-400" />;
    }
  };

  return (
    <div
      className={`flex flex-col items-center justify-center py-16 px-4 text-center ${className}`}
      role="status"
      aria-live="polite"
    >
      <div className="mb-6 opacity-80">
        {getIcon()}
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-2">
        {title}
      </h3>
      <p className="text-gray-600 max-w-md leading-relaxed mb-6">
        {message}
      </p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors shadow-md hover:shadow-lg"
        >
          {actionText}
        </button>
      )}
    </div>
  );
}

export default EmptyState;
