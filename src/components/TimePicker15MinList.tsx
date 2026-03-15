import { TIME_OPTIONS_15_MIN } from '../utils/dateTime';

interface TimePicker15MinListProps {
  value?: string;
  onChange: (value?: string) => void;
}

const TimePicker15MinList = ({ value, onChange }: TimePicker15MinListProps) => {
  return (
    <select
      value={value ?? ''}
      onChange={(event) => onChange(event.target.value || undefined)}
      className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
    >
      {TIME_OPTIONS_15_MIN.map((option) => (
        <option key={option.label} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default TimePicker15MinList;
