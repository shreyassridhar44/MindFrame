import React, { useState, useEffect, useRef } from 'react';
import Webcam from 'react-webcam';
import { Play, Pause, RotateCcw, Camera } from 'lucide-react';
import EmotionChart from '../components/EmotionChart';
import StressOMeter from '../components/StressOMeter';
import SessionTimer from '../components/SessionTimer';
import InsightsPanel from '../components/InsightsPanel';
import { generateRandomEmotions, calculateStressLevel, getInsight } from '../data/mock';

const Detector = () => {
  const [isActive, setIsActive] = useState(false);
  const [emotions, setEmotions] = useState([]);
  const [stressLevel, setStressLevel] = useState(0);
  const [insight, setInsight] = useState(null);
  const [sessionTime, setSessionTime] = useState(0);
  const webcamRef = useRef(null);

  // Simulate emotion detection when active
  useEffect(() => {
    let interval;
    if (isActive) {
      interval = setInterval(() => {
        const newEmotions = generateRandomEmotions();
        const newStressLevel = calculateStressLevel(newEmotions);
        const newInsight = getInsight(newStressLevel, newEmotions);
        
        setEmotions(newEmotions);
        setStressLevel(newStressLevel);
        setInsight(newInsight);
      }, 1500); // Update every 1.5 seconds
    }
    return () => clearInterval(interval);
  }, [isActive]);

  const handleStart = () => {
    setIsActive(true);
    setSessionTime(0);
  };

  const handlePause = () => {
    setIsActive(false);
  };

  const handleReset = () => {
    setIsActive(false);
    setEmotions([]);
    setStressLevel(0);
    setInsight(null);
    setSessionTime(0);
  };

  return (
    <div className="min-h-screen pt-20 pb-12 bg-gradient-to-br from-teal-50/50 via-white to-cyan-50/50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Emotion & Stress Detector
          </h1>
          <p className="text-gray-600">
            Real-time analysis of your facial expressions and stress levels
          </p>
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Video Feed */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video Feed Card */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-teal-100">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Camera className="w-5 h-5 text-teal-600" />
                    <h2 className="text-xl font-bold text-gray-900">Live Video Feed</h2>
                  </div>
                  {isActive && (
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="text-sm text-gray-600 font-medium">Recording</span>
                    </div>
                  )}
                </div>
                
                {/* Webcam */}
                <div className="relative bg-gray-900 rounded-xl overflow-hidden aspect-video">
                  <Webcam
                    ref={webcamRef}
                    audio={false}
                    screenshotFormat="image/jpeg"
                    className="w-full h-full object-cover"
                    mirrored={true}
                  />
                  
                  {/* Overlay when not active */}
                  {!isActive && (
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
                      <div className="text-center">
                        <Camera className="w-16 h-16 text-white/50 mx-auto mb-4" />
                        <p className="text-white text-lg">Click Start to begin detection</p>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Controls */}
                <div className="flex items-center justify-center space-x-4 mt-6">
                  {!isActive ? (
                    <button
                      onClick={handleStart}
                      className="flex items-center space-x-2 bg-gradient-to-r from-teal-500 to-cyan-500 text-white px-8 py-3 rounded-xl font-semibold hover:from-teal-600 hover:to-cyan-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                    >
                      <Play className="w-5 h-5" />
                      <span>Start Detection</span>
                    </button>
                  ) : (
                    <button
                      onClick={handlePause}
                      className="flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      <Pause className="w-5 h-5" />
                      <span>Pause</span>
                    </button>
                  )}
                  
                  <button
                    onClick={handleReset}
                    className="flex items-center space-x-2 bg-gray-100 text-gray-700 px-8 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-300"
                  >
                    <RotateCcw className="w-5 h-5" />
                    <span>Reset</span>
                  </button>
                </div>
              </div>
            </div>
            
            {/* Emotion Chart */}
            <EmotionChart emotions={emotions} isActive={isActive} />
          </div>

          {/* Right Column - Metrics */}
          <div className="space-y-6">
            {/* Session Timer */}
            <SessionTimer isActive={isActive} sessionTime={sessionTime} setSessionTime={setSessionTime} />
            
            {/* Stress-o-Meter */}
            <StressOMeter stressLevel={stressLevel} isActive={isActive} />
            
            {/* Insights Panel */}
            <InsightsPanel insight={insight} isActive={isActive} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Detector;