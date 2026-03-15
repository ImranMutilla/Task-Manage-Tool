import { Task } from '../types/task';
import { formatDueDateTime, isOverdue, priorityLabel, statusLabel } from '../utils/taskUtils';

interface FocusPanelProps {
  task: Task | null;
}

const FocusPanel = ({ task }: FocusPanelProps) => {
  return (
    <section className="rounded-3xl border border-black/5 bg-white/85 p-5 shadow-[0_30px_70px_-50px_rgba(15,23,42,0.45)] backdrop-blur">
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">Today&apos;s Focus</p>
      {task ? (
        <div className="mt-3 space-y-3">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900">{task.title}</h2>
            {task.description && <p className="mt-1 text-sm text-slate-500">{task.description}</p>}
          </div>

          <div className="flex flex-wrap gap-2 text-xs text-slate-600">
            <span className="rounded-full bg-slate-100 px-3 py-1.5">Priority · {priorityLabel[task.priority]}</span>
            <span className="rounded-full bg-slate-100 px-3 py-1.5">Status · {statusLabel[task.status]}</span>
            <span className="rounded-full bg-slate-100 px-3 py-1.5">Due · {formatDueDateTime(task.dueDateTime)}</span>
            {isOverdue(task) && <span className="rounded-full bg-rose-50 px-3 py-1.5 text-rose-700">Overdue</span>}
          </div>
        </div>
      ) : (
        <p className="mt-3 text-sm text-slate-500">All clear for now. No active tasks require attention.</p>
      )}
    </section>
  );
};

export default FocusPanel;
