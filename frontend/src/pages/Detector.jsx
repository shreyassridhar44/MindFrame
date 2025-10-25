import React, { useState, useRef, useEffect } from 'react';
import { Video, VideoOff, Play, Pause, RefreshCw } from 'lucide-react';

// Import all your components
import StressOMeter from '../components/StressOMeter';
import EmotionChart from '../components/EmotionChart';
import SessionTimer from '../components/SessionTimer';
import InsightsPanel from '../components/InsightsPanel';

// --- Helper Functions (No changes here) ---

const EMOTIONS_LIST = ['angry', 'disgust', 'fear', 'happy', 'sad', 'surprise', 'neutral'];
const EMOTION_COLORS = {
  angry: '#EF4444',   // Red
  disgust: '#8B5CF6', // Purple
  fear: '#F59E0B',    // Yellow
  happy: '#10B981',   // Green
  sad: '#3B82F6',    // Blue
  surprise: '#F97316', // Orange
  neutral: '#6B7280',  // Gray
};

const formatDataForChart = (data) => {
  if (!data || data.length === 0) {
    return EMOTIONS_LIST.map(name => ({
      name,
      probability: 0,
      color: EMOTION_COLORS[name]
    }));
  }
  return data.map((value, index) => ({
    name: EMOTIONS_LIST[index],
    probability: value,
    color: EMOTION_COLORS[EMOTIONS_LIST[index]]
  }));
};

const calculateStressLevel = (data) => {
  if (!data || data.length === 0) return 0;
  const stressScore = 
    (data[EMOTIONS_LIST.indexOf('angry')] + 
     data[EMOTIONS_LIST.indexOf('fear')] + 
     data[EMOTIONS_LIST.indexOf('sad')]);
  return Math.round(Math.min(stressScore, 1.0) * 100);
};

// --- The Main Page Component ---

const DetectorPage = () => {
  // --- State ---
  const [isActive, setIsActive] = useState(false); // Is detection running?
  const [isPaused, setIsPaused] = useState(false); // Is session paused?
  const [sessionTime, setSessionTime] = useState(0);
  const [stressLevel, setStressLevel] = useState(0);
  const [emotionChartData, setEmotionChartData] = useState(formatDataForChart([]));
  const [dominantEmotion, setDominantEmotion] = useState('neutral');
  const [error, setError] = useState(null);

  // --- Refs ---
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const intervalRef = useRef(null); // To store the prediction interval
  const timerRef = useRef(null); // To store the session timer interval

  // --- Core Functions ---

  /** 1. Starts the webcam and detection */
  const startDetection = async () => {
    setError(null);
    
    // If this is a new session (not paused), start the webcam
    if (!videoRef.current.srcObject) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { width: 640, height: 480 },
          audio: false 
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await new Promise((resolve) => {
            videoRef.current.onloadedmetadata = () => resolve();
          });
        }
      } catch (err) {
        console.error("Error accessing webcam:", err);
        setError("Could not access webcam. Please check browser permissions.");
        return;
      }
    }

    // Start detection and timers
    setIsActive(true);
    setIsPaused(false);
    
    // Start the prediction loop
    intervalRef.current = setInterval(captureAndPredict, 1000); // 1 frame per second
    
    // Start the session timer
    timerRef.current = setInterval(() => {
      setSessionTime(prev => prev + 1);
    }, 1000);
  };

  /** 2. Pauses the detection */
  const stopDetection = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (timerRef.current) clearInterval(timerRef.current);
    
    setIsPaused(true);
    setIsActive(false);
  };

  /** 3. Resets the entire session */
  const resetDetection = () => {
    // Stop all intervals
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (timerRef.current) clearInterval(timerRef.current);
    
    // Stop webcam
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    
    // Reset all state
    setIsActive(false);
    setIsPaused(false);
    setSessionTime(0);
    setStressLevel(0);
    setEmotionChartData(formatDataForChart([]));
    setDominantEmotion('neutral');
    setError(null);
  };

  /** 4. Captures a single frame and sends it to the API */
  const captureAndPredict = async () => {
    if (!videoRef.current || !canvasRef.current || !videoRef.current.srcObject) return;

    const context = canvasRef.current.getContext('2d');
    canvasRef.current.width = videoRef.current.videoWidth;
    canvasRef.current.height = videoRef.current.videoHeight;
    
    context.translate(videoRef.current.videoWidth, 0);
    context.scale(-1, 1);
    context.drawImage(videoRef.current, 0, 0, videoRef.current.videoWidth, videoRef.current.videoHeight);
    
    const base64Image = canvasRef.current.toDataURL('image/jpeg');

    try {
      const response = await fetch('http://localhost:8000/api/predict-emotion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64Image }),
      });

      if (!response.ok) throw new Error('API request failed');

      const data = await response.json(); // { emotion: "happy", all_predictions: [...] }
      
      setStressLevel(calculateStressLevel(data.all_predictions));
      setEmotionChartData(formatDataForChart(data.all_predictions));
      setDominantEmotion(data.emotion);

    } catch (err) {
      console.error("Prediction error:", err);
      // Don't stop the loop, just log the error
    }
  };

  // --- Cleanup Effect ---
  useEffect(() => {
    return () => {
      resetDetection(); // Clean up everything when component unmounts
    };
  }, []);
  
  const hasStarted = sessionTime > 0; // True if session has ever been active

  // --- JSX Layout ---
  return (
    <div className="pt-24 pb-12 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        {/* Main Grid Layout: 50/50 split on large screens */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* --- Left Column (Video + Controls) --- */}
          <div className="space-y-6">
            <div className="bg-black rounded-2xl shadow-lg overflow-hidden border border-gray-200 aspect-video w-full">
              {/* Show this placeholder when camera is OFF */}
              {!hasStarted && !isActive && (
                <div className="w-full h-full flex flex-col items-center justify-center text-gray-500">
                  <Video className="w-24 h-24 mb-4 opacity-50" />
                  <span className="text-lg font-medium">Camera is off</span>
                </div>
              )}

              {/* Video feed (always rendered, just hidden if no src) */}
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted 
                className={`w-full h-auto transform scale-x-[-1] ${!videoRef.current?.srcObject ? 'hidden' : 'block'}`}
              />
              
              {/* This canvas is hidden, used only for capturing frames */}
              <canvas ref={canvasRef} style={{ display: 'none' }} />
            </div>
            
            {/* --- Control Buttons --- */}
            <div className="grid grid-cols-3 gap-4">
              <button
                onClick={startDetection}
                disabled={isActive}
                className="flex items-center justify-center space-x-2 text-lg font-bold py-3 px-4 rounded-xl transition-all duration-300 shadow
                           bg-teal-600 text-white hover:bg-teal-700
                           disabled:bg-teal-300 disabled:cursor-not-allowed"
              >
                <Play className="w-5 h-5" />
                <span>{isPaused ? 'Resume' : 'Start'}</span>
              </button>
              
              <button
                onClick={stopDetection}
                disabled={!isActive}
                className="flex items-center justify-center space-x-2 text-lg font-bold py-3 px-4 rounded-xl transition-all duration-300 shadow
                           bg-orange-500 text-white hover:bg-orange-600
                           disabled:bg-orange-300 disabled:cursor-not-allowed"
              >
                <Pause className="w-5 h-5" />
                <span>Pause</span>
              </button>

              <button
                onClick={resetDetection}
                disabled={!hasStarted && !isActive}
                className="flex items-center justify-center space-x-2 text-lg font-bold py-3 px-4 rounded-xl transition-all duration-300 shadow
                           bg-red-600 text-white hover:bg-red-700
                           disabled:bg-red-300 disabled:cursor-not-allowed"
              >
                <RefreshCw className="w-5 h-5" />
                <span>Reset</span>
              </button>
            </div>
            
            {/* --- Minimalist Session Timer --- */}
            <SessionTimer 
              isActive={isActive} 
              sessionTime={sessionTime} 
              setSessionTime={setSessionTime} // Pass this down so it doesn't need its own interval
            />

            {/* --- Error Message --- */}
            {error && (
              <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg" role="alert">
                <span className="font-bold">Error: </span>
                <span className="block sm:inline">{error}</span>
              </div>
            )}
          </div>

          {/* --- Right Column (Data Widgets) --- */}
          <div className="space-y-8">
            {/* Horizontal grid for top two components */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <StressOMeter 
                stressLevel={stressLevel} 
                isActive={isActive || hasStarted} 
              />
              <EmotionChart 
                emotions={emotionChartData} 
                isActive={isActive || hasStarted} 
              />
            </div>
            
            {/* Insights Panel spans full width of this column */}
            <InsightsPanel 
              dominantEmotion={dominantEmotion}
              isActive={isActive} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetectorPage;