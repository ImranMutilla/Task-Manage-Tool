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
  mode = 'grid',
}: TaskBoardProps) => {
  if (mode === 'horizontal') {
    return (
      <section className="overflow-x-auto pb-1">
        <div className="flex min-w-max flex-nowrap gap-3">
          {columns.map((column) => (
            <div key={column.id} className="min-h-[240px] w-[290px] flex-shrink-0 rounded-xl border border-slate-200/70 bg-white/70 p-2.5">
              <div className="mb-1.5 px-1">
                <p className="text-sm font-medium text-slate-700">{column.title}</p>
                {column.subtitle && <p className="text-[11px] text-slate-400">{column.subtitle}</p>}
              </div>
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
  }

  return (
    <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {columns.map((column) => (
        <div key={column.id} className="rounded-xl border border-slate-200/70 bg-white/70 p-2.5">
          <div className="mb-1.5 px-1">
            <p className="text-sm font-medium text-slate-700">{column.title}</p>
            {column.subtitle && <p className="text-[11px] text-slate-400">{column.subtitle}</p>}
          </div>
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
          {column.onAdd && (
            <button onClick={column.onAdd} className="mt-1 rounded-md px-1 py-1 text-xs text-slate-500 hover:text-slate-800">
              {column.addLabel ?? '+ Add task'}
            </button>
          )}
        </div>
      ))}
    </section>
  );
};

export default TaskBoard;
