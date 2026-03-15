import { HOUR_OPTIONS, MINUTE_OPTIONS } from '../utils/dateTime';
import { TimeParts } from '../types/task';

interface TimePicker15MinProps {
  value?: TimeParts;
  onChange: (value?: TimeParts) => void;
}

const TimePicker15Min = ({ value, onChange }: TimePicker15MinProps) => {
  const nextValue: TimeParts = value ?? { hour: '9', minute: '00', period: 'AM' };

  return (
    <div className="flex items-center gap-2">
      <select
        value={value?.hour ?? ''}
        onChange={(event) => onChange({ ...nextValue, hour: event.target.value })}
        className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
      >
        <option value="">Hour</option>
        {HOUR_OPTIONS.map((hour) => (
          <option key={hour} value={hour}>
            {hour}
          </option>
        ))}
      </select>
      <select
        value={value?.minute ?? ''}
        onChange={(event) => onChange({ ...nextValue, minute: event.target.value as TimeParts['minute'] })}
        className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
      >
        <option value="">Min</option>
        {MINUTE_OPTIONS.map((minute) => (
          <option key={minute} value={minute}>
            {minute}
          </option>
        ))}
      </select>
      <select
        value={value?.period ?? ''}
        onChange={(event) => onChange({ ...nextValue, period: event.target.value as TimeParts['period'] })}
        className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
      >
        <option value="">AM/PM</option>
        <option value="AM">AM</option>
        <option value="PM">PM</option>
      </select>
      <button
        type="button"
        onClick={() => onChange(undefined)}
        className="rounded-xl border border-slate-200 px-2.5 py-2 text-xs text-slate-500 hover:bg-slate-50"
      >
        Clear
      </button>
    </div>
  );
};

export default TimePicker15Min;
