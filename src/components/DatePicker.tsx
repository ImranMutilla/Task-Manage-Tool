interface DatePickerProps {
  value: string;
  onChange: (value: string) => void;
}

const DatePicker = ({ value, onChange }: DatePickerProps) => {
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  const toDateInput = (date: Date) =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

  return (
    <div className="flex items-center gap-1">
      <button type="button" onClick={() => onChange(toDateInput(today))} className="rounded-lg bg-white px-2.5 py-2 text-xs text-slate-600 border border-slate-200">
        Today
      </button>
      <button type="button" onClick={() => onChange(toDateInput(tomorrow))} className="rounded-lg bg-white px-2.5 py-2 text-xs text-slate-600 border border-slate-200">
        Tomorrow
      </button>
      <input
        type="date"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-xs text-slate-600"
      />
    </div>
  );
};

export default DatePicker;
