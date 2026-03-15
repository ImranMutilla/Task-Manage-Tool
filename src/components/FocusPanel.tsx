import { Task } from '../types/task';
import { formatTaskDateTime } from '../utils/dateTime';
import { priorityLabel } from '../utils/taskUtils';

interface FocusPanelProps {
  tasks: Task[];
}

const FocusPanel = ({ tasks }: FocusPanelProps) => {
  if (!tasks.length) return null;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
      <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-400">Today&apos;s Focus</p>
      <div className="mt-2 grid gap-2 md:grid-cols-3">
        {tasks.map((task) => (
          <div key={task.id} className="rounded-xl bg-slate-50 px-3 py-2">
            <p className="truncate text-sm font-medium text-slate-800">{task.title}</p>
            <p className="mt-0.5 text-xs text-slate-500">
              {priorityLabel[task.priority]} · {task.projectName}
            </p>
            <p className="text-xs text-slate-500">{formatTaskDateTime(task.dueDateTime)}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FocusPanel;
