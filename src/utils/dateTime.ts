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
      items.push({
        value: `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`,
        label: new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit' }).format(date),
      });
    }
  }
  return items;
})();

export const toISODateTime = (date: string, time?: string): { iso: string; hasTime: boolean } => {
  if (!time) return { iso: new Date(`${date}T09:00`).toISOString(), hasTime: false };
  return { iso: new Date(`${date}T${time}`).toISOString(), hasTime: true };
};

export const fromISOToDate = (iso?: string): string => {
  if (!iso) return '';
  const parsed = new Date(iso);
  if (Number.isNaN(parsed.getTime())) return '';
  return `${parsed.getFullYear()}-${String(parsed.getMonth() + 1).padStart(2, '0')}-${String(parsed.getDate()).padStart(2, '0')}`;
};

export const fromISOToTimeValue = (iso?: string, hasTime?: boolean): string => {
  if (!iso || !hasTime) return '';
  const parsed = new Date(iso);
  if (Number.isNaN(parsed.getTime())) return '';
  return `${String(parsed.getHours()).padStart(2, '0')}:${String(parsed.getMinutes()).padStart(2, '0')}`;
};

const sameDay = (a: Date, b: Date): boolean =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

export const formatTaskDateTime = (iso?: string, hasTime = true): string => {
  if (!iso) return 'No date';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return 'Invalid date';

  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);

  const timeLabel = hasTime
    ? new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit' }).format(date)
    : '';

  if (sameDay(date, now)) return hasTime ? `Today · ${timeLabel}` : 'Today';
  if (sameDay(date, tomorrow)) return hasTime ? `Tomorrow · ${timeLabel}` : 'Tomorrow';

  const dayLabel = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date);
  return hasTime ? `${dayLabel} · ${timeLabel}` : dayLabel;
};

export const formatDateGroupTitle = (date: Date): string => {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  const base = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date);
  const weekday = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(date);
  if (sameDay(date, now)) return `${base} · Today · ${weekday}`;
  if (sameDay(date, tomorrow)) return `${base} · Tomorrow · ${weekday}`;
  return `${base} · ${weekday}`;
};

export const isToday = (iso?: string): boolean => {
  if (!iso) return false;
  const date = new Date(iso);
  return !Number.isNaN(date.getTime()) && sameDay(date, new Date());
};

export const startOfDay = (date: Date): Date => new Date(date.getFullYear(), date.getMonth(), date.getDate());

export const toLocalDateKey = (input: Date | string): string => {
  const date = typeof input === 'string' ? new Date(input) : input;
  if (Number.isNaN(date.getTime())) return '';
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

const getLastDayOfMonth = (year: number, monthIndex: number): number => new Date(year, monthIndex + 1, 0).getDate();

export const getNextRepeatDue = (iso: string, repeat: 'daily' | 'weekday' | 'weekly' | 'monthly'): string => {
  const source = new Date(iso);
  if (Number.isNaN(source.getTime())) return iso;

  const next = new Date(source);

  if (repeat === 'daily') {
    next.setDate(next.getDate() + 1);
    return next.toISOString();
  }

  if (repeat === 'weekday') {
    do {
      next.setDate(next.getDate() + 1);
    } while (next.getDay() === 0 || next.getDay() === 6);
    return next.toISOString();
  }

  if (repeat === 'weekly') {
    next.setDate(next.getDate() + 7);
    return next.toISOString();
  }

  const year = source.getFullYear();
  const month = source.getMonth();
  const day = source.getDate();
  const hours = source.getHours();
  const minutes = source.getMinutes();
  const seconds = source.getSeconds();
  const milliseconds = source.getMilliseconds();

  const targetMonth = month + 1;
  const targetYear = year + Math.floor(targetMonth / 12);
  const normalizedTargetMonth = targetMonth % 12;
  const clampedDay = Math.min(day, getLastDayOfMonth(targetYear, normalizedTargetMonth));

  const monthlyNext = new Date(targetYear, normalizedTargetMonth, clampedDay, hours, minutes, seconds, milliseconds);
  return monthlyNext.toISOString();
};
