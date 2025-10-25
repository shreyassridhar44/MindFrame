import React, { useEffect } from 'react';
import { Clock } from 'lucide-react';

const SessionTimer = ({ isActive, sessionTime, setSessionTime }) => {
  useEffect(() => {
    let interval;
    if (isActive) {
      interval = setInterval(() => {
        setSessionTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, setSessionTime]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-teal-100">
      <div className="flex items-center space-x-2 mb-4">
        <Clock className="w-5 h-5 text-teal-600" />
        <h2 className="text-xl font-bold text-gray-900">Session Timer</h2>
      </div>

      <div className="text-center">
        <div className="text-5xl font-bold text-gray-900 mb-2 font-mono">
          {formatTime(sessionTime)}
        </div>
        <p className="text-sm text-gray-600">
          {isActive ? 'Session in progress' : 'Session paused'}
        </p>
      </div>

      {/* Progress Ring */}
      <div className="mt-6">
        <div className="flex justify-center">
          <div className="relative w-32 h-32">
            <svg className="transform -rotate-90 w-32 h-32">
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="#e5e7eb"
                strokeWidth="8"
                fill="none"
              />
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="#14b8a6"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${(sessionTime % 60) * (2 * Math.PI * 56) / 60} ${2 * Math.PI * 56}`}
                strokeLinecap="round"
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold text-teal-600">{sessionTime % 60}</div>
                <div className="text-xs text-gray-500">seconds</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionTimer;