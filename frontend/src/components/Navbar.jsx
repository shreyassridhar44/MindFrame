import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Activity, Home, Gauge, User } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  
  const isActive = (path) => location.pathname === path;
  
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-white/80">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="bg-gradient-to-br from-teal-400 to-cyan-500 p-2 rounded-xl group-hover:shadow-lg transition-all duration-300">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
              MoodTrack
            </span>
          </Link>
          
          {/* Navigation Links */}
          <div className="flex items-center space-x-1">
            <Link
              to="/"
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                isActive('/')
                  ? 'bg-teal-50 text-teal-700'
                  : 'text-gray-600 hover:bg-teal-50/50 hover:text-teal-600'
              }`}
            >
              <Home className="w-5 h-5" />
              <span className="font-medium">Home</span>
            </Link>
            
            <Link
              to="/detector"
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                isActive('/detector')
                  ? 'bg-teal-50 text-teal-700'
                  : 'text-gray-600 hover:bg-teal-50/50 hover:text-teal-600'
              }`}
            >
              <Gauge className="w-5 h-5" />
              <span className="font-medium">Detector</span>
            </Link>
            
            <Link
              to="/profile"
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                isActive('/profile')
                  ? 'bg-teal-50 text-teal-700'
                  : 'text-gray-600 hover:bg-teal-50/50 hover:text-teal-600'
              }`}
            >
              <User className="w-5 h-5" />
              <span className="font-medium">Profile</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;