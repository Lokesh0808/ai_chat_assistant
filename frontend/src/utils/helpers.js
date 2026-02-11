export const generateSessionId = () => {
  return `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const formatTime = (date) => {
  return new Date(date).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
};

export const truncateText = (text, maxLength = 100) => {
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};

export const calculateSimilarity = (str1, str2) => {
  const s1 = str1.toLowerCase();
  const s2 = str2.toLowerCase();
  
  if (s1 === s2) return 1;
  
  const longer = s1.length > s2.length ? s1 : s2;
  const shorter = s1.length > s2.length ? s2 : s1;
  
  if (longer.length === 0) return 1;
  
  const editDistance = getEditDistance(longer, shorter);
  return (longer.length - editDistance) / longer.length;
};

const getEditDistance = (s1, s2) => {
  const costs = [];
  for (let k = 0; k <= s1.length; k++) {
    let lastValue = k;
    for (let i = 0; i <= s2.length; i++) {
      if (k === 0) {
        costs[i] = i;
      } else if (i > 0) {
        let newValue = costs[i - 1];
        if (s1.charAt(k - 1) !== s2.charAt(i - 1)) {
          newValue = Math.min(Math.min(newValue, lastValue), costs[i]) + 1;
        }
        costs[i - 1] = lastValue;
        lastValue = newValue;
      }
    }
    if (k > 0) costs[s2.length] = lastValue;
  }
  return costs[s2.length];
};
