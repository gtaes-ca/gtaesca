function getPartsInTimezone(instant, timeZone) {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  const parts = Object.fromEntries(
    formatter
      .formatToParts(instant)
      .filter((part) => part.type !== 'literal')
      .map((part) => [part.type, part.value])
  );

  let hour = Number(parts.hour);
  if (hour === 24) {
    hour = 0;
  }

  return {
    year: Number(parts.year),
    month: Number(parts.month),
    day: Number(parts.day),
    hour,
    minute: Number(parts.minute),
    second: Number(parts.second),
  };
}

export function zonedTimeToUtc(dateStr, hour, minute, timeZone) {
  const [year, month, day] = dateStr.split('-').map(Number);
  let utcMs = Date.UTC(year, month - 1, day, hour, minute, 0);

  for (let i = 0; i < 5; i += 1) {
    const parts = getPartsInTimezone(new Date(utcMs), timeZone);
    const asUtc = Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, 0);
    const wantUtc = Date.UTC(year, month - 1, day, hour, minute, 0);
    utcMs += wantUtc - asUtc;
  }

  return new Date(utcMs);
}

export function getWeekdayInTimezone(dateStr, timeZone) {
  const noonUtc = zonedTimeToUtc(dateStr, 12, 0, timeZone);
  const weekday = new Intl.DateTimeFormat('en-US', { timeZone, weekday: 'short' }).format(noonUtc);
  const map = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  return map[weekday];
}

export function getTodayDateStr(timeZone) {
  const parts = getPartsInTimezone(new Date(), timeZone);
  const y = parts.year;
  const m = String(parts.month).padStart(2, '0');
  const d = String(parts.day).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function addDaysToDateStr(dateStr, days, timeZone) {
  const noon = zonedTimeToUtc(dateStr, 12, 0, timeZone);
  noon.setUTCDate(noon.getUTCDate() + days);
  const parts = getPartsInTimezone(noon, timeZone);
  const y = parts.year;
  const m = String(parts.month).padStart(2, '0');
  const d = String(parts.day).padStart(2, '0');
  return `${y}-${m}-${d}`;
}
