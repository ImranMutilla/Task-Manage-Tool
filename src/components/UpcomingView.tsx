import { Task } from '../types/task';
import TaskList from './TaskList';

interface UpcomingGroup {
  date: string;
  label: string;
  items: Task[];
}

interface UpcomingViewProps {
  groups: UpcomingGroup[];
  monthLabel: string;
  onPrevWeek: () => void;
  onNextWeek: () => void;
  onGoToday: () => void;
  onAddByDate: (date: string) => void;
  onToggleDone: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onDuplicate: (task: Task) => void;
  onOpenDetail: (task: Task) => void;
}

const UpcomingView = ({ groups, monthLabel, onPrevWeek, onNextWeek, onGoToday, onAddByDate, onToggleDone, onEdit, onDelete, onDuplicate, onOpenDetail }: UpcomingViewProps) => {
  return (
    <div className="space-y-3">
      <section className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-3">
        <h3 className="text-sm font-semibold text-slate-800">{monthLabel}</h3>
        <div className="flex items-center gap-2">
          <button onClick={onPrevWeek} className="rounded-lg border border-slate-200 px-2 py-1 text-xs">Prev week</button>
          <button onClick={onGoToday} className="rounded-lg border border-slate-200 px-2 py-1 text-xs">Today</button>
          <button onClick={onNextWeek} className="rounded-lg border border-slate-200 px-2 py-1 text-xs">Next week</button>
        </div>
      </section>

      {groups.map((group) => (
        <section key={group.date} className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <h4 className="text-sm font-medium text-slate-600">{group.label}</h4>
            <button onClick={() => onAddByDate(group.date)} className="text-xs text-slate-500 hover:text-slate-800">+ Add task</button>
          </div>
          <TaskList tasks={group.items} emptyMessage="No tasks for this day." onToggleDone={onToggleDone} onEdit={onEdit} onDelete={onDelete} onDuplicate={onDuplicate} onOpenDetail={onOpenDetail} />
        </section>
      ))}
    </div>
  );
};

export default UpcomingView;
