import React from 'react';

const SessionTimer = ({ sessionTime }) => {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 border border-teal-100">
      <div className="text-center">
        <p className="text-sm text-gray-500 mb-1">Session Duration</p>
        <div className="text-4xl font-bold text-gray-900 font-mono">
          {formatTime(sessionTime)}
        </div>
      </div>
    </div>
  );
};

export default SessionTimer;