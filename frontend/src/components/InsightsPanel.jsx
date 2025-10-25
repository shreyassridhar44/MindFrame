import React, { useEffect, useState } from 'react';
import { Lightbulb, Sparkles, MessageSquare } from 'lucide-react';

// --- PUT YOUR *NEW* GEMINI API KEY HERE ---
const API_KEY = 'AIzaSyADBg14Y5Ey_wXv0t25HBghdAgZK8UIDyU';
// --- THIS URL IS NOW FIXED ---
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

// Define initial, general tips
const initialTips = [
  'Take deep breaths when stress levels rise',
  'Regular breaks improve emotional balance',
];

const InsightsPanel = ({ dominantEmotion, averageStress, isActive, setIsChatModalOpen }) => {
  const [insight, setInsight] = useState('Start a detection session to receive personalized insights.');
  const [tips, setTips] = useState(initialTips); // State for quick tips
  const [isLoading, setIsLoading] = useState(false);

  // This effect fetches a SUMMARY and TIPS when the session stops
  useEffect(() => {
    // Check if the session just stopped (isActive is false, but averageStress just got a number)
    if (!isActive && averageStress !== null) {
      const getSessionSummaryAndTips = async () => {
        if (API_KEY.includes("PASTE_YOUR")) {
          setInsight("Please add your Gemini API key to InsightsPanel.jsx to enable summaries.");
          return;
        }

        setIsLoading(true);
        // Updated prompt to ask for both a summary and two tips in a structured format
        const prompt = `A user just finished a session. Their dominant emotion was "${dominantEmotion}" and average stress was ${averageStress}%.
        Provide a response in the following format, without any extra text or markdown:
        SUMMARY: [A short, empathetic 1-2 sentence summary of the session.]
        TIPS:
        1. [A constructive, personalized tip based on the data.]
        2. [Another constructive, personalized tip based on the data.]`;

        try {
          const response = await fetch(GEMINI_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 200,
              }
            })
          });

          if (!response.ok) {
            const errorData = await response.json();
            console.error("Gemini API Error Response:", errorData);
            throw new Error(`API request failed with status ${response.status}`);
          }

          const data = await response.json();
          const rawText = data.candidates[0].content.parts[0].text;

          // --- Parse the response to separate summary and tips ---
          const summaryMatch = rawText.match(/SUMMARY:\s*(.*)/);
          const tipsMatch = rawText.match(/TIPS:\s*1.\s*(.*)\s*2.\s*(.*)/);

          const newInsight = summaryMatch ? summaryMatch[1].trim() : "Here's your session summary. We couldn't generate tips this time.";
          const newTips = tipsMatch ? [tipsMatch[1].trim(), tipsMatch[2].trim()] : initialTips;
          
          setInsight(newInsight);
          setTips(newTips);

        } catch (error) {
          console.error("Gemini API Error:", error);
          setInsight("Could not fetch a session summary. Please check the console for details.");
          setTips(initialTips); // Reset to default tips on error
        } finally {
          setIsLoading(false);
        }
      };

      getSessionSummaryAndTips();
    }
    
    // Reset insight and tips if session is active
    if (isActive) {
      setInsight('Your session is live. A summary will be generated when you pause.');
      setTips(initialTips); // Show general tips during the session
      setIsLoading(false);
    }

    // Reset insight and tips if session is fully reset
    if (averageStress === null) {
        setInsight('Start a detection session to receive personalized insights.');
        setTips(initialTips);
        setIsLoading(false);
    }

  }, [averageStress, dominantEmotion, isActive]); // Re-run when these change

  const sessionHasEnded = !isActive && averageStress !== null;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
      <div className="flex items-center space-x-2 mb-4">
        <Sparkles className="w-5 h-5 text-teal-600" />
        <h2 className="text-xl font-bold text-gray-900">
          {sessionHasEnded ? 'Session Summary' : 'Key Insights'}
        </h2>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 min-h-[100px] flex items-center justify-center">
        {isLoading ? (
          <div className="flex items-center space-x-2 text-gray-500">
            <Lightbulb className="w-5 h-5 animate-pulse" />
            <span>Generating summary...</span>
          </div>
        ) : (
          <p className="text-gray-800 text-sm leading-relaxed text-center">
            {insight}
          </p>
        )}
      </div>
      
      {/* Quick Tips & Chat Button --- */}
      <div className="mt-6 flex items-start gap-4">
        <div className="flex-1 space-y-3">
          <h3 className="text-sm font-semibold text-gray-700">Quick Tips:</h3>
          {/* --- Dynamically render tips from state --- */}
          <div className="space-y-2">
            {tips.map((tip, index) => (
              <div key={index} className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-teal-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm text-gray-600">{tip}</p>
              </div>
            ))}
          </div>
        </div>

        {/* --- Chat with AI Button --- */}
        {sessionHasEnded && (
          <button 
            onClick={() => setIsChatModalOpen(true)}
            className="flex-shrink-0 flex items-center space-x-2 bg-teal-600 text-white px-4 py-2 rounded-lg shadow hover:bg-teal-700 transition-all"
          >
            <MessageSquare className="w-4 h-4" />
            <span className="text-sm font-medium">Chat with AI</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default InsightsPanel;