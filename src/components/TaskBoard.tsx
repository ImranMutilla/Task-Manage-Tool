import { Task } from '../types/task';
import TaskList from './TaskList';

export interface TaskBoardColumn {
  id: string;
  title: string;
  subtitle?: string;
  tasks: Task[];
  emptyMessage: string;
  addLabel?: string;
  onAdd?: () => void;
}

interface TaskBoardProps {
  columns: TaskBoardColumn[];
  onToggleDone: (task: Task) => void;
  onSetStatus?: (task: Task, status: Task['status']) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onDuplicate: (task: Task) => void;
  onOpenDetail: (task: Task) => void;
  enableStatusMenu?: boolean;
  mode?: 'grid' | 'horizontal';
}

const TaskBoard = ({
  columns,
  onToggleDone,
  onSetStatus,
  onEdit,
  onDelete,
  onDuplicate,
  onOpenDetail,
  enableStatusMenu = false,
}: TaskBoardProps) => {
  return (
    <section className="overflow-x-auto pb-1">
      <div className="flex min-w-max flex-nowrap items-start gap-3">
        {columns.map((column) => (
          <div
            key={column.id}
            className="flex min-h-[240px] w-[320px] min-w-[320px] max-w-[320px] flex-col rounded-xl border border-slate-200/70 bg-white/75 p-2.5"
          >
            <div className="mb-1.5 px-1">
              <p className="text-sm font-medium text-slate-700">{column.title}</p>
              {column.subtitle && <p className="text-[11px] text-slate-400">{column.subtitle}</p>}
            </div>

            <div className="flex-1">
              <TaskList
                tasks={column.tasks}
                emptyMessage={column.emptyMessage}
                onToggleDone={onToggleDone}
                onSetStatus={onSetStatus}
                enableStatusMenu={enableStatusMenu}
                onEdit={onEdit}
                onDelete={onDelete}
                onDuplicate={onDuplicate}
                onOpenDetail={onOpenDetail}
              />
            </div>

            {column.onAdd && (
              <button onClick={column.onAdd} className="mt-1 rounded-md px-1 py-1 text-xs text-slate-500 hover:text-slate-800">
                {column.addLabel ?? '+ Add task'}
              </button>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default TaskBoard;
