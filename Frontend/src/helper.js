export const calculateTotal = (timeIn , timeOut) => {
    if (!timeIn || !timeOut) return "00:00";

    let [hourIn, minIn] = timeIn.split(":").map(Number);
    let [hourOut, minOut] = timeOut.split(":").map(Number);

    if (minIn > minOut) {
        minOut += 60;
        hourIn += 1;
    }

    let totalHour = hourOut - hourIn;
    let totalMin = minOut - minIn;

    if (totalHour < 0 || totalMin < 0) return "00:00";

    totalHour = totalHour < 10 ? `0${totalHour}` : `${totalHour}`;
    totalMin = totalMin < 10 ? `0${totalMin}` : `${totalMin}`;

    return `${totalHour}:${totalMin}`;
};

// Group entries by week
export const groupByWeek = (entries) => {
  const weeks = {};
  entries.forEach(entry => {
    const date = new Date(entry.newDate);
    const week = getWeekOfMonth(date);
    if (!weeks[week]) weeks[week] = [];
    weeks[week].push(entry);
  });
  return weeks; 
};

// Get week number in the month (starting from 1)
export const getWeekOfMonth = (date) => {
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  const dayOfMonth = date.getDate();
  const adjustedDate = dayOfMonth + firstDay.getDay(); // shift by first day
  return Math.ceil(adjustedDate / 7);
};

// Calculate total hours from entries
export const totalHours = (entries) => {
  let hour = 0, min = 0;

  entries.forEach(e => {
    if (!e.totalHour) return;
    const [h, m] = e.totalHour.split(':').map(Number);
    hour += h || 0;
    min += m || 0;
  });

  hour += Math.floor(min / 60);
  min = min % 60;

  return `${hour} hour${hour !== 1 ? 's' : ''} ${min} min${min !== 1 ? 's' : ''}`;
};


// Format ISO date strings
export const formatDate = (isoString) => isoString?.split('T')[0] || '';

