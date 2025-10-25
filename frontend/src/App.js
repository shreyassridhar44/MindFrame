import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import your components and pages
import Navbar from './components/Navbar';
import DetectorPage from './pages/Detector';
// You can create and import these other pages later
// import HomePage from './pages/HomePage'; 
// import ProfilePage from './pages/ProfilePage';

function App() {
  return (
    <Router>
      {/* Navbar is fixed and will appear on all pages */}
      <Navbar />

      {/* Routes define which page to show based on the URL */}
      <Routes>
        {/* We'll make the DetectorPage the home page for now */}
        <Route path="/" element={<DetectorPage />} />
        <Route path="/detector" element={<DetectorPage />} />
        
        {/* You can add these routes later when you build the pages */}
        {/* <Route path="/" element={<HomePage />} /> */}
        {/* <Route path="/profile" element={<ProfilePage />} /> */}
      </Routes>
    </Router>
  );
}

export default App;