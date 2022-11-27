// Format from YYYY-MM-DD to MM/DD/YYYY
export const formatDate = (date) => {
  return date.slice(5, 7) + "/" + date.slice(8, 10) + "/" + date.slice(0, 4);
};

// Format from military time HH:MM:SS to 12-hour HH:MM AM/PM
export const formatTime = (time) => {
  let hour = parseInt(time.slice(0, 2));
  let suffix = hour > 12 ? "PM" : "AM";
  hour = String(hour > 12 ? hour - 12 : hour).padStart(2, "0");
  return hour + ":" + time.slice(3, 5) + " " + suffix;
};