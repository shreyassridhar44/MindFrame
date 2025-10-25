// Mock data for the stress and mood detection app

export const mockEmotions = [
  { name: 'Happy', probability: 0.15, color: '#10b981' },
  { name: 'Sad', probability: 0.08, color: '#3b82f6' },
  { name: 'Angry', probability: 0.05, color: '#ef4444' },
  { name: 'Surprised', probability: 0.12, color: '#f59e0b' },
  { name: 'Fearful', probability: 0.10, color: '#8b5cf6' },
  { name: 'Disgusted', probability: 0.07, color: '#ec4899' },
  { name: 'Neutral', probability: 0.43, color: '#6b7280' }
];

export const mockUser = {
  name: 'Sarah Johnson',
  email: 'sarah.j@example.com',
  avatar: null
};

export const mockHistory = [
  {
    id: 1,
    date: '2025-01-15',
    time: '10:30 AM',
    dominantEmotion: 'Neutral',
    stressLevel: 35,
    duration: '5m 23s'
  },
  {
    id: 2,
    date: '2025-01-14',
    time: '3:45 PM',
    dominantEmotion: 'Happy',
    stressLevel: 20,
    duration: '8m 12s'
  },
  {
    id: 3,
    date: '2025-01-14',
    time: '11:20 AM',
    dominantEmotion: 'Surprised',
    stressLevel: 45,
    duration: '3m 45s'
  },
  {
    id: 4,
    date: '2025-01-13',
    time: '2:15 PM',
    dominantEmotion: 'Neutral',
    stressLevel: 30,
    duration: '6m 50s'
  },
  {
    id: 5,
    date: '2025-01-12',
    time: '9:00 AM',
    dominantEmotion: 'Happy',
    stressLevel: 15,
    duration: '4m 30s'
  }
];

export const mockInsights = [
  {
    id: 1,
    message: 'Your stress levels are consistently low in the morning. Consider scheduling important tasks during this time.',
    type: 'success'
  },
  {
    id: 2,
    message: 'Detected increased stress during afternoon sessions. Try taking short breaks every hour.',
    type: 'warning'
  },
  {
    id: 3,
    message: 'Great job maintaining a calm demeanor! Your neutral emotion frequency is optimal for productivity.',
    type: 'info'
  }
];

// Function to generate random emotion data (for simulation)
export const generateRandomEmotions = () => {
  const emotions = ['Happy', 'Sad', 'Angry', 'Surprised', 'Fearful', 'Disgusted', 'Neutral'];
  const colors = ['#10b981', '#3b82f6', '#ef4444', '#f59e0b', '#8b5cf6', '#ec4899', '#6b7280'];
  
  let remaining = 1.0;
  const data = emotions.map((name, index) => {
    let probability;
    if (index === emotions.length - 1) {
      probability = remaining;
    } else {
      probability = Math.random() * remaining * 0.5;
      remaining -= probability;
    }
    return {
      name,
      probability: Math.round(probability * 100) / 100,
      color: colors[index]
    };
  });
  
  // Sort by probability descending
  return data.sort((a, b) => b.probability - a.probability);
};

// Calculate stress level from emotions
export const calculateStressLevel = (emotions) => {
  const stressWeights = {
    'Happy': -0.5,
    'Sad': 0.3,
    'Angry': 0.8,
    'Surprised': 0.4,
    'Fearful': 0.9,
    'Disgusted': 0.5,
    'Neutral': 0.0
  };
  
  let stressScore = 0;
  emotions.forEach(emotion => {
    stressScore += emotion.probability * (stressWeights[emotion.name] || 0);
  });
  
  // Normalize to 0-100 scale
  const normalizedStress = Math.max(0, Math.min(100, (stressScore + 0.5) * 100));
  return Math.round(normalizedStress);
};

// Get stress color based on level
export const getStressColor = (level) => {
  if (level < 30) return '#10b981'; // Green
  if (level < 60) return '#f59e0b'; // Yellow
  return '#ef4444'; // Red
};

// Get insight based on stress level and emotions
export const getInsight = (stressLevel, emotions) => {
  const dominant = emotions[0]?.name || 'Neutral';
  
  if (stressLevel < 30) {
    return {
      message: `You're maintaining excellent composure with ${dominant.toLowerCase()} as your dominant emotion. Keep up the great work!`,
      type: 'success'
    };
  } else if (stressLevel < 60) {
    return {
      message: `Moderate stress detected. Your ${dominant.toLowerCase()} emotion suggests you might benefit from a short break or breathing exercise.`,
      type: 'warning'
    };
  } else {
    return {
      message: `High stress level detected with ${dominant.toLowerCase()} emotion. Consider stepping away for a few minutes to reset and recharge.`,
      type: 'error'
    };
  }
};