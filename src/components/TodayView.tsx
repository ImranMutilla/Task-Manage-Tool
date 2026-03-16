import { Task } from '../types/task';
import { formatTaskDateTime } from '../utils/dateTime';
import { priorityMeta } from '../utils/taskUtils';
import TaskList from './TaskList';

interface TodayViewProps {
  overdue: Task[];
  dueToday: Task[];
  flexible: Task[];
  doneToday: number;
  upNext?: Task;
  onToggleDone: (task: Task) => void;
  onSetStatus: (task: Task, status: Task['status']) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onDuplicate: (task: Task) => void;
  onOpenDetail: (task: Task) => void;
  onQuickAddToday: () => void;
}

const TodayView = ({
  overdue,
  dueToday,
  flexible,
  doneToday,
  upNext,
  onToggleDone,
  onSetStatus,
  onEdit,
  onDelete,
  onDuplicate,
  onOpenDetail,
  onQuickAddToday,
}: TodayViewProps) => {
  const total = overdue.length + dueToday.length + flexible.length + doneToday;
  const remaining = overdue.length + dueToday.length + flexible.length;
  const rate = total ? Math.round((doneToday / total) * 100) : 0;

  return (
    <div className="space-y-4">
      <section className="grid grid-cols-2 gap-2 rounded-xl bg-white/80 p-3 text-sm text-slate-600 md:grid-cols-4">
        <p>Total today: {total}</p>
        <p>Done: {doneToday}</p>
        <p>Remaining: {remaining}</p>
        <p>Completion: {rate}%</p>
      </section>

      {upNext && (
        <section className="rounded-xl border border-slate-200 bg-white p-3 text-sm">
          <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Up next</p>
          <p className="mt-1 font-medium text-slate-800">{upNext.title}</p>
          <p className="mt-1 text-xs text-slate-500">
            {formatTaskDateTime(upNext.dueDateTime, upNext.dueHasTime)} · {upNext.projectName}
          </p>
          <div className="mt-1.5 flex items-center gap-2">
            <span className={`inline-flex rounded-full px-2 py-0.5 text-[11px] ${priorityMeta[upNext.priority].className}`}>
              {priorityMeta[upNext.priority].label}
            </span>
            {upNext.status !== 'in-progress' && upNext.status !== 'done' && (
              <button onClick={() => onSetStatus(upNext, 'in-progress')} className="rounded-md px-2 py-0.5 text-xs text-slate-600 hover:bg-slate-100">
                Start now
              </button>
            )}
            <button onClick={() => onOpenDetail(upNext)} className="rounded-md px-2 py-0.5 text-xs text-slate-600 hover:bg-slate-100">
              Open details
            </button>
          </div>
        </section>
      )}

      <section className="space-y-1">
        <h3 className="px-1 text-sm font-medium text-slate-600">Overdue</h3>
        <TaskList
          tasks={overdue}
          emptyMessage="No overdue tasks."
          onToggleDone={onToggleDone}
          onSetStatus={onSetStatus}
          enableStatusMenu
          onEdit={onEdit}
          onDelete={onDelete}
          onDuplicate={onDuplicate}
          onOpenDetail={onOpenDetail}
        />
      </section>

      <section className="space-y-1">
        <h3 className="px-1 text-sm font-medium text-slate-600">Due Today</h3>
        <TaskList
          tasks={dueToday}
          emptyMessage="Nothing scheduled for today."
          onToggleDone={onToggleDone}
          onSetStatus={onSetStatus}
          enableStatusMenu
          onEdit={onEdit}
          onDelete={onDelete}
          onDuplicate={onDuplicate}
          onOpenDetail={onOpenDetail}
        />
      </section>

      <section className="space-y-1">
        <h3 className="px-1 text-sm font-medium text-slate-600">No Time / Flexible</h3>
        <TaskList
          tasks={flexible}
          emptyMessage="No flexible tasks for today."
          onToggleDone={onToggleDone}
          onSetStatus={onSetStatus}
          enableStatusMenu
          onEdit={onEdit}
          onDelete={onDelete}
          onDuplicate={onDuplicate}
          onOpenDetail={onOpenDetail}
        />
      </section>

      <button onClick={onQuickAddToday} className="rounded-md px-1 py-1 text-sm text-slate-500 hover:text-slate-800">
        + Add task for today
      </button>
    </div>
  );
};

export default TodayView;
