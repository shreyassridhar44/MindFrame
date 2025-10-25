import React from 'react';
import { Lightbulb, AlertCircle, CheckCircle, Info } from 'lucide-react';

const InsightsPanel = ({ insight, isActive }) => {
  const getInsightStyle = (type) => {
    const styles = {
      success: {
        bg: 'bg-green-50',
        border: 'border-green-200',
        text: 'text-green-800',
        icon: CheckCircle,
        iconColor: 'text-green-500'
      },
      warning: {
        bg: 'bg-orange-50',
        border: 'border-orange-200',
        text: 'text-orange-800',
        icon: AlertCircle,
        iconColor: 'text-orange-500'
      },
      error: {
        bg: 'bg-red-50',
        border: 'border-red-200',
        text: 'text-red-800',
        icon: AlertCircle,
        iconColor: 'text-red-500'
      },
      info: {
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        text: 'text-blue-800',
        icon: Info,
        iconColor: 'text-blue-500'
      }
    };
    return styles[type] || styles.info;
  };

  const style = insight ? getInsightStyle(insight.type) : getInsightStyle('info');
  const Icon = style.icon;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-teal-100">
      <div className="flex items-center space-x-2 mb-4">
        <Lightbulb className="w-5 h-5 text-teal-600" />
        <h2 className="text-xl font-bold text-gray-900">Insights & Suggestions</h2>
      </div>

      {insight && isActive ? (
        <div className={`${style.bg} ${style.border} border rounded-xl p-4 transition-all duration-300`}>
          <div className="flex items-start space-x-3">
            <Icon className={`w-5 h-5 ${style.iconColor} flex-shrink-0 mt-0.5`} />
            <p className={`${style.text} text-sm leading-relaxed`}>
              {insight.message}
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
          <div className="flex items-start space-x-3">
            <Lightbulb className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
            <p className="text-gray-600 text-sm leading-relaxed">
              {isActive 
                ? 'Analyzing your emotions... Insights will appear shortly.'
                : 'Start a detection session to receive personalized insights based on your emotional state and stress levels.'}
            </p>
          </div>
        </div>
      )}

      {/* Tips Section */}
      <div className="mt-6 space-y-3">
        <h3 className="text-sm font-semibold text-gray-700">Quick Tips:</h3>
        <div className="space-y-2">
          <div className="flex items-start space-x-2">
            <div className="w-1.5 h-1.5 bg-teal-500 rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-sm text-gray-600">Take deep breaths when stress levels rise</p>
          </div>
          <div className="flex items-start space-x-2">
            <div className="w-1.5 h-1.5 bg-teal-500 rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-sm text-gray-600">Regular breaks improve emotional balance</p>
          </div>
          <div className="flex items-start space-x-2">
            <div className="w-1.5 h-1.5 bg-teal-500 rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-sm text-gray-600">Track patterns to understand triggers</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsightsPanel;