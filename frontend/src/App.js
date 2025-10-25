import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import your components and pages
import Navbar from './components/Navbar';
import HomePage from './pages/Home'; // <-- Import your new Home page
import DetectorPage from './pages/Detector';
// import ProfilePage from './pages/ProfilePage'; // You can add this later

function App() {
  return (
    <Router>
      {/* Navbar is fixed and will appear on all pages */}
      <Navbar />

      {/* Routes define which page to show based on the URL */}
      <Routes>
        {/* This is the fix: */}
        <Route path="/" element={<HomePage />} /> {/* <-- Root path now shows Home */}
        <Route path="/detector" element={<DetectorPage />} /> {/* <-- Detector path works */}
        
        {/* You can add this route later when you build the page */}
        {/* <Route path="/profile" element={<ProfilePage />} /> */}
      </Routes>
    </Router>
  );
}

export default App;