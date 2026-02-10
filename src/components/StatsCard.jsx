import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

/**
 * StatsCard component
 * Displays a statistic with icon, title, value, and trend
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.icon - Icon to display
 * @param {string} props.title - Card title
 * @param {string|number} props.value - Main statistic value
 * @param {number} props.trend - Percentage change (positive or negative)
 * @param {string} props.trendLabel - Label for trend (e.g., "vs last month")
 * @param {string} props.color - Color variant: 'red', 'blue', 'green', 'yellow'
 */
function StatsCard({
  icon,
  title,
  value,
  trend = null,
  trendLabel = 'vs last month',
  color = 'red'
}) {
  const colorClasses = {
    red: 'bg-red-50 text-red-600 border-red-200',
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    green: 'bg-green-50 text-green-600 border-green-200',
    yellow: 'bg-yellow-50 text-yellow-600 border-yellow-200'
  };

  const trendColor = trend >= 0 ? 'text-green-600' : 'text-red-600';
  const TrendIcon = trend >= 0 ? TrendingUp : TrendingDown;

  return (
    <div className={`p-6 rounded-xl border-2 ${colorClasses[color]} shadow-lg hover:shadow-xl transition-all`}>
      {/* Header with icon */}
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-lg bg-${color}-100`}>
          {icon}
        </div>
        {trend !== null && (
          <div className={`flex items-center gap-1 text-sm font-semibold ${trendColor}`}>
            <TrendIcon size={16} />
            <span>{Math.abs(trend)}%</span>
          </div>
        )}
      </div>

      {/* Content */}
      <p className="text-gray-600 text-sm font-medium mb-2">
        {title}
      </p>
      <p className="text-3xl font-bold text-gray-900 mb-1">
        {value}
      </p>
      {trend !== null && (
        <p className="text-xs text-gray-500">
          {trendLabel}
        </p>
      )}
    </div>
  );
}

export default StatsCard;
