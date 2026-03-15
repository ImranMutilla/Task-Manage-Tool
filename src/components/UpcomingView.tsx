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
  onSetStatus?: (task: Task, status: Task['status']) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onDuplicate: (task: Task) => void;
  onOpenDetail: (task: Task) => void;
  enableStatusMenu?: boolean;
}

const getFirstTimeHint = (items: Task[]): string => {
  const timed = items.filter((item) => item.dueHasTime && item.dueDateTime).sort((a, b) => new Date(a.dueDateTime!).getTime() - new Date(b.dueDateTime!).getTime());
  if (!timed.length) return '';
  return ` · first at ${new Date(timed[0].dueDateTime!).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`;
};

const UpcomingView = ({
  groups,
  monthLabel,
  onPrevWeek,
  onNextWeek,
  onGoToday,
  onAddByDate,
  onToggleDone,
  onSetStatus,
  onEdit,
  onDelete,
  onDuplicate,
  onOpenDetail,
  enableStatusMenu = false,
}: UpcomingViewProps) => {
  return (
    <div className="space-y-3.5">
      <section className="flex items-center justify-between px-1">
        <h3 className="text-sm font-semibold text-slate-800">{monthLabel}</h3>
        <div className="flex items-center gap-1.5">
          <button onClick={onPrevWeek} className="rounded-lg px-2 py-1 text-xs text-slate-500 hover:bg-slate-100">Prev</button>
          <button onClick={onGoToday} className="rounded-lg border border-slate-200 px-2 py-1 text-xs text-slate-600">Today</button>
          <button onClick={onNextWeek} className="rounded-lg px-2 py-1 text-xs text-slate-500 hover:bg-slate-100">Next</button>
        </div>
      </section>

      {groups.map((group) => (
        <section key={group.date} className="space-y-1 border-t border-slate-200/60 pt-2.5 first:border-t-0 first:pt-0">
          <div className="flex items-center justify-between px-1">
            <div>
              <h4 className="text-sm font-medium text-slate-600">{group.label}</h4>
              <p className="text-[11px] text-slate-400">{group.items.length} task{group.items.length === 1 ? '' : 's'}{getFirstTimeHint(group.items)}</p>
            </div>
            <button onClick={() => onAddByDate(group.date)} className="text-xs text-slate-400 transition hover:text-slate-700">+ Add task</button>
          </div>
          <TaskList
            tasks={group.items}
            emptyMessage="Nothing planned."
            onToggleDone={onToggleDone}
            onSetStatus={onSetStatus}
            enableStatusMenu={enableStatusMenu}
            onEdit={onEdit}
            onDelete={onDelete}
            onDuplicate={onDuplicate}
            onOpenDetail={onOpenDetail}
          />
        </section>
      ))}
    </div>
  );
};

export default UpcomingView;
