import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Gauge, Info } from 'lucide-react'; // 1. Imported the 'Info' icon

const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-lg border-b border-gray-200/80 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Logo/Title */}
          <Link to="/" className="flex items-center group">
            <span className="text-2xl font-bold bg-gradient-to-r from-teal-500 via-cyan-500 to-emerald-500 bg-clip-text text-transparent group-hover:opacity-90 transition-opacity">
              MindFrame
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-2">
            <NavLink to="/" icon={Home} label="Home" isActive={isActive('/')} />
            <NavLink to="/detector" icon={Gauge} label="Detector" isActive={isActive('/detector')} />
            {/* 2. Added the new NavLink for the About page */}
            <NavLink to="/about" icon={Info} label="About" isActive={isActive('/about')} />
          </div>
        </div>
      </div>
    </nav>
  );
};

// Helper component for cleaner NavLink structure
const NavLink = ({ to, icon: Icon, label, isActive }) => (
  <Link
    to={to}
    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 group relative overflow-hidden ${
      isActive
        ? 'bg-teal-50 text-teal-700 font-medium'
        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
    }`}
  >
    <Icon className={`w-5 h-5 transition-colors ${isActive ? 'text-teal-600' : 'text-gray-500 group-hover:text-gray-700'}`} />
    <span className="font-medium text-sm">{label}</span>
    <span className={`absolute bottom-0 left-0 h-0.5 bg-teal-500 transition-all duration-300 ease-out ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
  </Link>
);

export default Navbar;