import React, { useEffect, useState } from 'react';
import { Lightbulb, Sparkles, MessageSquare } from 'lucide-react';

// --- PUT YOUR NEW OPENAI API KEY HERE ---
const OPENAI_API_KEY = "sk-1234abcd5678efgh1234abcd5678efgh1234abcd";

const InsightsPanel = ({ dominantEmotion, averageStress, isActive, setIsChatModalOpen }) => {
  const [insight, setInsight] = useState('Start a detection session to receive personalized insights.');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isActive && averageStress !== null) {
      const getSessionSummary = async () => {
        if (!OPENAI_API_KEY || OPENAI_API_KEY.startsWith("sk-xxxx")) {
          setInsight("Please add your new OpenAI API key to enable session summaries.");
          return;
        }

        setIsLoading(true);

        const prompt = `A user finished a session. Dominant emotion: "${dominantEmotion}". Average stress: ${averageStress}%. 
        Provide a warm, supportive 2-3 sentence summary. Avoid markdown formatting.`;

        try {
          const response = await fetch("https://api.openai.com/v1/responses", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
              model: "gpt-4o-mini",
              messages: [
                { role: "system", content: "You are MindFrame, an empathetic emotional wellness guide." },
                { role: "user", content: prompt }
              ],
              temperature: 0.7,
              max_output_tokens: 150
            })
          });

          const data = await response.json();
          const summary = data.output_text?.trim() || "No summary available.";
          setInsight(summary);

        } catch (error) {
          console.error("OpenAI API Error:", error);
          setInsight("Couldn't generate summary. Please try again later.");
        } finally {
          setIsLoading(false);
        }
      };

      getSessionSummary();
    }

    if (isActive) {
      setInsight('Your session is live. A summary will appear when you pause.');
      setIsLoading(false);
    }

    if (averageStress === null) {
      setInsight('Start a detection session to receive personalized insights.');
      setIsLoading(false);
    }

  }, [averageStress, dominantEmotion, isActive]);

  const sessionHasEnded = !isActive && averageStress !== null;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-teal-100">
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
      
      <div className="mt-6 flex items-start gap-4">
        <div className="flex-1 space-y-3">
          <h3 className="text-sm font-semibold text-gray-700">Quick Tips:</h3>
          <div className="space-y-2">
            <div className="flex items-start space-x-2">
              <div className="w-1.5 h-1.5 bg-teal-500 rounded-full mt-2"></div>
              <p className="text-sm text-gray-600">Take deep breaths when stress rises.</p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-1.5 h-1.5 bg-teal-500 rounded-full mt-2"></div>
              <p className="text-sm text-gray-600">Short breaks improve emotional balance.</p>
            </div>
          </div>
        </div>

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
