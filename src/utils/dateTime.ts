import { TimeParts } from '../types/task';

export const MINUTE_OPTIONS: Array<TimeParts['minute']> = ['00', '15', '30', '45'];

export const HOUR_OPTIONS = Array.from({ length: 12 }, (_, index) => String(index + 1));

export const isValidDate = (value?: string): boolean => {
  if (!value) return false;
  const parsed = new Date(value);
  return !Number.isNaN(parsed.getTime());
};

export const toISODateTime = (date: string, time?: TimeParts): string => {
  if (!time) {
    return new Date(`${date}T09:00`).toISOString();
  }

  const hour24 =
    time.period === 'AM'
      ? time.hour === '12'
        ? 0
        : Number(time.hour)
      : time.hour === '12'
        ? 12
        : Number(time.hour) + 12;

  const hh = String(hour24).padStart(2, '0');
  return new Date(`${date}T${hh}:${time.minute}`).toISOString();
};

export const fromISOToDate = (iso?: string): string => {
  if (!iso || !isValidDate(iso)) return '';
  return new Date(iso).toISOString().slice(0, 10);
};

export const fromISOToTimeParts = (iso?: string): TimeParts | undefined => {
  if (!iso || !isValidDate(iso)) return undefined;
  const date = new Date(iso);
  const hours = date.getHours();
  const minute = date.getMinutes();
  const minuteRounded = MINUTE_OPTIONS.includes(String(minute).padStart(2, '0') as TimeParts['minute'])
    ? (String(minute).padStart(2, '0') as TimeParts['minute'])
    : '00';

  if (hours === 0) return { hour: '12', minute: minuteRounded, period: 'AM' };
  if (hours < 12) return { hour: String(hours), minute: minuteRounded, period: 'AM' };
  if (hours === 12) return { hour: '12', minute: minuteRounded, period: 'PM' };
  return { hour: String(hours - 12), minute: minuteRounded, period: 'PM' };
};

const isSameDay = (a: Date, b: Date): boolean =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

export const formatTaskDateTime = (iso?: string): string => {
  if (!iso || !isValidDate(iso)) return 'No time';
  const date = new Date(iso);
  const now = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(now.getDate() + 1);

  const timeLabel = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);

  if (isSameDay(date, now)) return `Today at ${timeLabel}`;
  if (isSameDay(date, tomorrow)) return `Tomorrow at ${timeLabel}`;

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
};

export const isToday = (iso?: string): boolean => {
  if (!iso || !isValidDate(iso)) return false;
  return isSameDay(new Date(iso), new Date());
};

export const isTomorrow = (iso?: string): boolean => {
  if (!iso || !isValidDate(iso)) return false;
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return isSameDay(new Date(iso), tomorrow);
};

export const startOfDay = (date: Date): Date => new Date(date.getFullYear(), date.getMonth(), date.getDate());
