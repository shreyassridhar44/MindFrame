import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp } from 'lucide-react';

const EmotionChart = ({ emotions, isActive }) => {
  // Convert emotions data for Recharts
  const chartData = emotions.map(emotion => ({
    name: emotion.name,
    probability: (emotion.probability * 100).toFixed(1),
    color: emotion.color
  }));

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-teal-100">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <TrendingUp className="w-5 h-5 text-teal-600" />
          <h2 className="text-xl font-bold text-gray-900">Emotion Probability Chart</h2>
        </div>
        {isActive && (
          <span className="text-sm text-teal-600 font-medium">Live Updates</span>
        )}
      </div>

      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="name" 
              tick={{ fill: '#6b7280', fontSize: 12 }}
              axisLine={{ stroke: '#d1d5db' }}
            />
            <YAxis 
              tick={{ fill: '#6b7280', fontSize: 12 }}
              axisLine={{ stroke: '#d1d5db' }}
              label={{ value: 'Probability (%)', angle: -90, position: 'insideLeft', style: { fill: '#6b7280' } }}
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
      ) : (
        <div className="h-[300px] flex items-center justify-center text-gray-400">
          <div className="text-center">
            <TrendingUp className="w-12 h-12 mx-auto mb-2 opacity-30" />
            <p>Start detection to see emotion probabilities</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmotionChart;