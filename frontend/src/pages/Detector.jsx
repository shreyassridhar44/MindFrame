import React, { useState, useRef, useEffect } from 'react';
import { Video, Play, Pause, RefreshCw, BarChart } from 'lucide-react';

// Import all your components
import StressOMeter from '../components/StressOMeter';
import EmotionChart from '../components/EmotionChart';
import SessionTimer from '../components/SessionTimer';
import InsightsPanel from '../components/InsightsPanel';
import ChatModal from '../components/ChatModal';

// --- Helper Functions ---
const EMOTIONS_LIST = ['angry', 'disgust', 'fear', 'happy', 'sad', 'surprise', 'neutral'];
const EMOTION_COLORS = {
  angry: '#EF4444',
  disgust: '#8B5CF6',
  fear: '#F59E0B',
  happy: '#10B981',
  sad: '#3B82F6',
  surprise: '#F97316',
  neutral: '#6B7280',
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

// --- Main Component ---
const DetectorPage = () => {
  // --- State ---
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [sessionTime, setSessionTime] = useState(0);
  const [stressLevel, setStressLevel] = useState(0);
  const [emotionChartData, setEmotionChartData] = useState(formatDataForChart([]));
  const [dominantEmotion, setDominantEmotion] = useState('neutral');
  const [error, setError] = useState(null);

  const [totalStress, setTotalStress] = useState(0);
  const [readingCount, setReadingCount] = useState(0);
  const [averageStress, setAverageStress] = useState(null);

  const [finalEmotionChartData, setFinalEmotionChartData] = useState(null); // persist chart
  const [finalStressLevel, setFinalStressLevel] = useState(0); // persist stress
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);

  // --- Refs ---
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const intervalRef = useRef(null); 
  const timerRef = useRef(null); 

  // --- Core Functions ---
  const startDetection = async () => {
    setError(null);
    setAverageStress(null);

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

    setIsActive(true);
    setIsPaused(false);
    
    intervalRef.current = setInterval(captureAndPredict, 1000);
    timerRef.current = setInterval(() => {
      setSessionTime(prev => prev + 1);
    }, 1000);
  };

  const stopDetection = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (timerRef.current) clearInterval(timerRef.current);
    
    setIsPaused(true);
    setIsActive(false);

    if (readingCount > 0) {
      setAverageStress(Math.round(totalStress / readingCount));
    }

    // Persist last captured data
    setFinalEmotionChartData(emotionChartData);
    setFinalStressLevel(stressLevel);
  };

  const resetDetection = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (timerRef.current) clearInterval(timerRef.current);

    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }

    setIsActive(false);
    setIsPaused(false);
    setSessionTime(0);
    setStressLevel(0);
    setEmotionChartData(formatDataForChart([]));
    setDominantEmotion('neutral');
    setError(null);

    setTotalStress(0);
    setReadingCount(0);
    setAverageStress(null);
    setFinalEmotionChartData(null);
    setFinalStressLevel(0);
  };

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
      const response = await fetch('https://mindframe-1.onrender.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64Image }),
      });

      if (!response.ok) throw new Error('API request failed');

      const data = await response.json();

      const newStressLevel = calculateStressLevel(data.all_predictions);

      setStressLevel(newStressLevel);
      setEmotionChartData(formatDataForChart(data.all_predictions));
      setDominantEmotion(data.emotion);

      setTotalStress(prevTotal => prevTotal + newStressLevel);
      setReadingCount(prevCount => prevCount + 1);

    } catch (err) {
      console.error("Prediction error:", err);
    }
  };

  useEffect(() => {
    return () => {
      resetDetection();
    };
  }, []);

  const hasStarted = sessionTime > 0;

  return (
    <>
      <div className="pt-24 pb-12 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* Left Column */}
            <div className="space-y-6">
              <div className="bg-black rounded-2xl shadow-lg overflow-hidden border border-gray-200 aspect-video w-full">
                {!hasStarted && !isActive && (
                  <div className="w-full h-full flex flex-col items-center justify-center text-gray-500">
                    <Video className="w-24 h-24 mb-4 opacity-50" />
                    <span className="text-lg font-medium">Camera is off</span>
                  </div>
                )}
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  muted 
                  className={`w-full h-auto transform scale-x-[-1] ${!videoRef.current?.srcObject ? 'hidden' : 'block'}`}
                />
                <canvas ref={canvasRef} style={{ display: 'none' }} />
              </div>

              {averageStress !== null && (
                <div className="bg-white border-2 border-teal-500 p-4 rounded-2xl shadow-lg text-center">
                  <div className="flex items-center justify-center space-x-2 text-teal-700">
                    <BarChart className="w-5 h-5" />
                    <h3 className="text-lg font-semibold">Session Paused: Summary</h3>
                  </div>
                  <p className="text-gray-600 mt-2">Your average stress level for this session was:</p>
                  <p className="text-5xl font-bold text-gray-900 mt-1">{averageStress}%</p>
                </div>
              )}

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

              <SessionTimer 
                isActive={isActive} 
                sessionTime={sessionTime} 
                setSessionTime={setSessionTime} 
              />

              {error && (
                <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg" role="alert">
                  <span className="font-bold">Error: </span>
                  <span className="block sm:inline">{error}</span>
                </div>
              )}
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <StressOMeter 
                  stressLevel={isActive ? stressLevel : finalStressLevel} 
                  isActive={isActive || hasStarted} 
                />
                <EmotionChart 
                  emotions={isActive ? emotionChartData : finalEmotionChartData || emotionChartData} 
                  isActive={isActive || hasStarted} 
                />
              </div>

              <InsightsPanel 
                dominantEmotion={dominantEmotion}
                averageStress={averageStress}
                isActive={isActive} 
                setIsChatModalOpen={setIsChatModalOpen} 
              />
            </div>
          </div>
        </div>
      </div>

      {averageStress !== null && (
        <ChatModal 
          isOpen={isChatModalOpen}
          onClose={() => setIsChatModalOpen(false)}
          averageStress={averageStress}
          dominantEmotion={dominantEmotion}
        />
      )}
    </>
  );
};

export default DetectorPage;
