import React from 'react';
import { User, LogOut, Clock, TrendingUp, Calendar } from 'lucide-react';
import { mockUser, mockHistory } from '../data/mock';

const Profile = () => {
  const handleLogout = () => {
    alert('Logout functionality will be implemented with backend integration');
  };

  const getEmotionColor = (emotion) => {
    const colors = {
      'Happy': 'text-green-600 bg-green-50',
      'Sad': 'text-blue-600 bg-blue-50',
      'Angry': 'text-red-600 bg-red-50',
      'Surprised': 'text-orange-600 bg-orange-50',
      'Fearful': 'text-purple-600 bg-purple-50',
      'Disgusted': 'text-pink-600 bg-pink-50',
      'Neutral': 'text-gray-600 bg-gray-50'
    };
    return colors[emotion] || colors['Neutral'];
  };

  const getStressLevelColor = (level) => {
    if (level < 30) return 'text-green-600 bg-green-50';
    if (level < 60) return 'text-orange-600 bg-orange-50';
    return 'text-red-600 bg-red-50';
  };

  return (
    <div className="min-h-screen pt-20 pb-12 bg-gradient-to-br from-teal-50/50 via-white to-cyan-50/50">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Profile</h1>
          <p className="text-gray-600">Manage your account and view your history</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* User Info Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-teal-100">
              {/* Avatar */}
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="w-32 h-32 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-full flex items-center justify-center">
                    <User className="w-16 h-16 text-white" />
                  </div>
                  <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 rounded-full border-4 border-white"></div>
                </div>
              </div>

              {/* User Details */}
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-1">
                  {mockUser.name}
                </h2>
                <p className="text-gray-600">{mockUser.email}</p>
              </div>

              {/* Stats */}
              <div className="space-y-4 mb-6">
                <div className="bg-teal-50 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 text-sm">Total Sessions</span>
                    <span className="text-2xl font-bold text-teal-600">{mockHistory.length}</span>
                  </div>
                </div>
                <div className="bg-cyan-50 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 text-sm">Avg. Stress Level</span>
                    <span className="text-2xl font-bold text-cyan-600">
                      {Math.round(mockHistory.reduce((sum, h) => sum + h.stressLevel, 0) / mockHistory.length)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>

          {/* History Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg border border-teal-100">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-teal-600" />
                  <h2 className="text-xl font-bold text-gray-900">Session History</h2>
                </div>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  {mockHistory.map((session) => (
                    <div
                      key={session.id}
                      className="bg-gradient-to-r from-teal-50/50 to-cyan-50/50 rounded-xl p-5 border border-teal-100 hover:shadow-md transition-all duration-300 hover:-translate-y-1"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <Calendar className="w-5 h-5 text-teal-600" />
                          <div>
                            <p className="font-semibold text-gray-900">{session.date}</p>
                            <p className="text-sm text-gray-600">{session.time}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-600 font-medium">{session.duration}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white rounded-lg p-3">
                          <p className="text-xs text-gray-600 mb-1">Dominant Emotion</p>
                          <div className="flex items-center space-x-2">
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-lg text-sm font-semibold ${
                                getEmotionColor(session.dominantEmotion)
                              }`}
                            >
                              {session.dominantEmotion}
                            </span>
                          </div>
                        </div>

                        <div className="bg-white rounded-lg p-3">
                          <p className="text-xs text-gray-600 mb-1">Stress Level</p>
                          <div className="flex items-center space-x-2">
                            <TrendingUp className="w-4 h-4 text-gray-500" />
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-lg text-sm font-bold ${
                                getStressLevelColor(session.stressLevel)
                              }`}
                            >
                              {session.stressLevel}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;