export const formatTime = (date: Date, timezone: string = 'America/Chicago'): string => {
  return new Date(date).toLocaleTimeString('en-US', {
    timeZone: timezone,
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

export const formatOfficeHours = (hours: string): string => {
  return `in office till ${hours}`;
};

export const getCurrentTime = (timezone: string = 'America/Chicago'): string => {
  return formatTime(new Date(), timezone);
};