import React from 'react';
import { Gauge } from 'lucide-react';
import { getStressColor } from '../data/mock';

const StressOMeter = ({ stressLevel, isActive }) => {
  const color = getStressColor(stressLevel);
  const percentage = stressLevel;
  
  // Calculate the stroke dash offset for circular progress
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const getStressLabel = (level) => {
    if (level < 30) return { text: 'Calm', emoji: 'Relaxed' };
    if (level < 60) return { text: 'Moderate', emoji: 'Alert' };
    return { text: 'High Stress', emoji: 'Tense' };
  };

  const stressLabel = getStressLabel(stressLevel);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-teal-100">
      <div className="flex items-center space-x-2 mb-6">
        <Gauge className="w-5 h-5 text-teal-600" />
        <h2 className="text-xl font-bold text-gray-900">Stress-o-Meter</h2>
      </div>

      <div className="flex flex-col items-center">
        {/* Circular Progress */}
        <div className="relative w-48 h-48">
          {/* Background Circle */}
          <svg className="transform -rotate-90 w-48 h-48">
            <circle
              cx="96"
              cy="96"
              r={radius}
              stroke="#e5e7eb"
              strokeWidth="12"
              fill="none"
            />
            {/* Progress Circle */}
            <circle
              cx="96"
              cy="96"
              r={radius}
              stroke={color}
              strokeWidth="12"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          
          {/* Center Content */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl font-bold" style={{ color }}>
                {stressLevel}%
              </div>
              <div className="text-sm text-gray-600 mt-1">
                {stressLabel.text}
              </div>
            </div>
          </div>
        </div>

        {/* Status Indicator */}
        <div className="mt-6 w-full">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-gray-600">Status:</span>
            <span className="font-semibold" style={{ color }}>
              {stressLabel.emoji}
            </span>
          </div>
          
          {/* Color Scale */}
          <div className="h-2 rounded-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 relative">
            <div 
              className="absolute w-3 h-3 bg-white border-2 rounded-full -top-0.5 transition-all duration-1000"
              style={{ 
                left: `${percentage}%`,
                borderColor: color,
                transform: 'translateX(-50%)'
              }}
            />
          </div>
          
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Calm</span>
            <span>Moderate</span>
            <span>High</span>
          </div>
        </div>

        {!isActive && (
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-400">Waiting for detection to start...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StressOMeter;