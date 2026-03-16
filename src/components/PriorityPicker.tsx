import { TaskPriority } from '../types/task';
import { priorityMeta } from '../utils/taskUtils';

interface PriorityPickerProps {
  value: TaskPriority;
  onChange: (value: TaskPriority) => void;
}

const PriorityPicker = ({ value, onChange }: PriorityPickerProps) => {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value as TaskPriority)}
      className={`rounded-lg border px-3 py-2 text-sm ${priorityMeta[value].className}`}
    >
      {(['p1', 'p2', 'p3', 'p4'] as TaskPriority[]).map((priority) => (
        <option key={priority} value={priority}>
          {priorityMeta[priority].label}
        </option>
      ))}
    </select>
  );
};

export default PriorityPicker;
