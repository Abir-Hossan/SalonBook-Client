export function localDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function isBookableDate(value: string, today = localDateKey()) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || value < today) return false;
  const date = new Date(`${value}T12:00:00`);
  return Number.isFinite(date.getTime()) && localDateKey(date) === value;
}

export const bookingTimes = ["09:30 AM", "10:30 AM", "11:30 AM", "01:00 PM", "02:30 PM", "04:00 PM"];
