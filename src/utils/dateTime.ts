export interface TimeOption {
  value: string;
  label: string;
}

export const TIME_OPTIONS_15_MIN: TimeOption[] = (() => {
  const items: TimeOption[] = [{ value: '', label: 'No time' }];
  for (let hour = 0; hour < 24; hour += 1) {
    for (const minute of [0, 15, 30, 45]) {
      const date = new Date();
      date.setHours(hour, minute, 0, 0);
      const hh = String(hour).padStart(2, '0');
      const mm = String(minute).padStart(2, '0');
      items.push({
        value: `${hh}:${mm}`,
        label: new Intl.DateTimeFormat('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        }).format(date),
      });
    }
  }
  return items;
})();

export const toISODateTime = (date: string, time?: string): string => {
  if (!time) return new Date(`${date}T09:00`).toISOString();
  return new Date(`${date}T${time}`).toISOString();
};

export const fromISOToDate = (iso?: string): string => {
  if (!iso) return '';
  const parsed = new Date(iso);
  if (Number.isNaN(parsed.getTime())) return '';
  return `${parsed.getFullYear()}-${String(parsed.getMonth() + 1).padStart(2, '0')}-${String(parsed.getDate()).padStart(2, '0')}`;
};

export const fromISOToTimeValue = (iso?: string): string => {
  if (!iso) return '';
  const parsed = new Date(iso);
  if (Number.isNaN(parsed.getTime())) return '';
  return `${String(parsed.getHours()).padStart(2, '0')}:${String(parsed.getMinutes()).padStart(2, '0')}`;
};

const sameDay = (a: Date, b: Date): boolean =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

export const formatTaskDateTime = (iso?: string): string => {
  if (!iso) return 'No date';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return 'Invalid date';

  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);

  const hasTime = !(date.getHours() === 9 && date.getMinutes() === 0);
  const timeLabel = hasTime
    ? new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit' }).format(date)
    : '';

  if (sameDay(date, now)) return hasTime ? `Today · ${timeLabel}` : 'Today';
  if (sameDay(date, tomorrow)) return hasTime ? `Tomorrow · ${timeLabel}` : 'Tomorrow';

  const dayLabel = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date);
  return hasTime ? `${dayLabel} · ${timeLabel}` : dayLabel;
};

export const isToday = (iso?: string): boolean => {
  if (!iso) return false;
  const date = new Date(iso);
  return !Number.isNaN(date.getTime()) && sameDay(date, new Date());
};

export const startOfDay = (date: Date): Date => new Date(date.getFullYear(), date.getMonth(), date.getDate());
