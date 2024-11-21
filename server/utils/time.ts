export const getCurrentTime = (timezone: string = 'America/Chicago') => {
  const date = new Date();
  const time = date.toLocaleTimeString('en-US', {
    timeZone: timezone,
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
  return time;
};

export const formatOfficeHours = (start: number, end: number) => {
  return `in office till ${end}`;
};