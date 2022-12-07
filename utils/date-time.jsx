// Format from YYYY-MM-DD to MM/DD/YYYY
export const formatDate = (date) => {
  return `${date.slice(5, 7)}/${date.slice(8, 10)}/${date.slice(0, 4)}`;
};

// Format from military time HH:MM:SS to 12-hour HH:MM AM/PM
export const formatTime = (time) => {
  let hour = parseInt(time.slice(0, 2));
  let suffix = hour >= 12 ? "pm" : "am";
  hour = String(hour > 12 ? hour - 12 : hour == 0 ? 12 : hour).padStart(2, "0");
  return `${hour}:${time.slice(3, 5)} ${suffix}`;
};

// Retrieve current date in YYYY-MM-DD format and current time in HH:MM:SS format
export const getNow = () => {
  const now = new Date();
  const [year, month, day] = [now.getFullYear(), now.getMonth()+1, now.getDate()];
  const [hours, minutes, seconds] = [now.getHours(), now.getMinutes(), now.getSeconds()];

  year = String(year).padStart(2, "0");
  month = String(month).padStart(2, "0");
  day = String(day).padStart(2, "0");
  const date = `${year}-${month}-${day}`;

  hours = String(hours).padStart(2, "0");
  minutes = String(minutes).padStart(2, "0");
  seconds = String(seconds).padStart(2, "0");
  const time = `${hours}:${minutes}:${seconds}`;

  return [date, time];
}