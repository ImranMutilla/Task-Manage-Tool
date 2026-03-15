import { Task } from '../types/task';
import TaskList from './TaskList';

interface TodayViewProps {
  overdue: Task[];
  dueToday: Task[];
  flexible: Task[];
  onToggleDone: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onDuplicate: (task: Task) => void;
  onOpenDetail: (task: Task) => void;
  onQuickAddToday: () => void;
}

const TodayView = ({ overdue, dueToday, flexible, onToggleDone, onEdit, onDelete, onDuplicate, onOpenDetail, onQuickAddToday }: TodayViewProps) => {
  const total = overdue.length + dueToday.length + flexible.length;
  return (
    <div className="space-y-3">
      <section className="rounded-2xl border border-slate-200 bg-white p-3 text-sm text-slate-600">
        Today summary · Total {total} · Completed hidden · Remaining {total}
      </section>

      <section className="space-y-2">
        <h3 className="text-sm font-medium text-slate-600">Overdue</h3>
        <TaskList tasks={overdue} emptyMessage="No overdue tasks." onToggleDone={onToggleDone} onEdit={onEdit} onDelete={onDelete} onDuplicate={onDuplicate} onOpenDetail={onOpenDetail} />
      </section>
      <section className="space-y-2">
        <h3 className="text-sm font-medium text-slate-600">Due Today</h3>
        <TaskList tasks={dueToday} emptyMessage="No timed tasks today." onToggleDone={onToggleDone} onEdit={onEdit} onDelete={onDelete} onDuplicate={onDuplicate} onOpenDetail={onOpenDetail} />
      </section>
      <section className="space-y-2">
        <h3 className="text-sm font-medium text-slate-600">No Time / Flexible</h3>
        <TaskList tasks={flexible} emptyMessage="Nothing flexible for today." onToggleDone={onToggleDone} onEdit={onEdit} onDelete={onDelete} onDuplicate={onDuplicate} onOpenDetail={onOpenDetail} />
      </section>

      <button onClick={onQuickAddToday} className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-600">+ Add task for today</button>
    </div>
  );
};

export default TodayView;
