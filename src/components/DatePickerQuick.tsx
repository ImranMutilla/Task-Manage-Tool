import { useMemo } from 'react';

interface DatePickerQuickProps {
  value: string;
  onChange: (value: string) => void;
}

const toInputDate = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

const DatePickerQuick = ({ value, onChange }: DatePickerQuickProps) => {
  const nextWeekend = useMemo(() => {
    const date = new Date();
    while (date.getDay() !== 6) date.setDate(date.getDate() + 1);
    return toInputDate(date);
  }, []);

  const nextWeek = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() + 7);
    return toInputDate(date);
  }, []);

  const today = toInputDate(new Date());
  const tomorrowDate = new Date();
  tomorrowDate.setDate(tomorrowDate.getDate() + 1);
  const tomorrow = toInputDate(tomorrowDate);

  return (
    <div className="flex items-center gap-1">
      <select
        value=""
        onChange={(event) => {
          if (event.target.value === 'none') onChange('');
          if (event.target.value === 'today') onChange(today);
          if (event.target.value === 'tomorrow') onChange(tomorrow);
          if (event.target.value === 'weekend') onChange(nextWeekend);
          if (event.target.value === 'nextWeek') onChange(nextWeek);
        }}
        className="rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-xs text-slate-600"
      >
        <option value="">Quick date</option>
        <option value="none">No date</option>
        <option value="today">Today</option>
        <option value="tomorrow">Tomorrow</option>
        <option value="weekend">This weekend</option>
        <option value="nextWeek">Next week</option>
      </select>
      <input
        type="date"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-xs text-slate-600"
      />
    </div>
  );
};

export default DatePickerQuick;
