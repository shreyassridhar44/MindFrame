import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp } from 'lucide-react';

// UPDATED: Changed prop name from 'isActive' to 'isLive' for clarity.
// The 'emotions' prop will contain the saved data when the session is paused (handled by the parent).
// The 'isLive' prop should *only* be true when the session is actively running.
const EmotionChart = ({ emotions, isLive }) => {
  // Convert emotions data for Recharts
  const chartData = emotions.map(emotion => ({
    name: emotion.name,
    probability: (emotion.probability * 100).toFixed(1),
    color: emotion.color
  }));

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border-teal-100">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <TrendingUp className="w-5 h-5 text-teal-600" />
          <h2 className="text-xl font-bold text-gray-900">Emotion Probability</h2>
        </div>
        {/* UPDATED: This badge now correctly uses the 'isLive' prop */}
        {isLive && (
          <span className="text-sm text-teal-600 font-medium">Live</span>
        )}
      </div>

      {/* This logic is correct. 
        When the session is paused, the parent component (`DetectorPage`) will pass the 
        `finalEmotionChartData` (the saved state) as the 'emotions' prop.
        This will not be all zeros, so the chart will remain visible.
      */}
      <div className="h-[300px]"> {/* Set a fixed height for the container */}
        {chartData.every(d => d.probability == 0) ? (
          <div className="h-full flex items-center justify-center text-gray-400">
            <div className="text-center">
              <TrendingUp className="w-12 h-12 mx-auto mb-2 opacity-30" />
              <p>Start detection to see emotion probabilities</p>
            </div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={chartData} 
              // Added more bottom margin for the angled labels
              margin={{ top: 10, right: 10, left: -20, bottom: 30 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="name" 
                tick={{ fill: '#6b7280', fontSize: 11 }} // Slightly smaller font
                axisLine={{ stroke: '#d1d5db' }}
                interval={0} // 1. Ensures all labels are shown
                angle={-45} // 2. Angles the labels
                textAnchor="end" // 3. Aligns the angled labels correctly
                height={50} // 4. Gives space for the angled labels
              />
              <YAxis 
                tick={{ fill: '#6b7280', fontSize: 12 }}
                axisLine={{ stroke: '#d1d5db' }}
                label={{ value: 'Probability (%)', angle: -90, position: 'insideLeft', style: { fill: '#6b7280', fontSize: 12 } }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
                formatter={(value) => [`${value}%`, 'Probability']}
              />
              <Bar dataKey="probability" radius={[8, 8, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default EmotionChart;

