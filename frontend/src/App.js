import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import your components and pages
import Navbar from './components/Navbar';
import HomePage from './pages/Home'; // <-- Import your new Home page
import DetectorPage from './pages/Detector';
import AboutPage from './pages/About'; // 1. Import the new About page

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
        
        {/* 2. Added the new route for the About page */}
        <Route path="/about" element={<AboutPage />} />

        {/* You can add this route later when you build the page */}
        {/* <Route path="/profile" element={<ProfilePage />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
