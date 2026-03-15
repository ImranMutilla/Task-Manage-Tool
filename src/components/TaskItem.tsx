import { Task } from '../types/task';
import { formatTaskDateTime } from '../utils/dateTime';
import { isOverdue, priorityLabel } from '../utils/taskUtils';

interface TaskItemProps {
  task: Task;
  onToggleDone: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

const TaskItem = ({ task, onToggleDone, onEdit, onDelete }: TaskItemProps) => {
  const overdue = isOverdue(task);
  const isDone = task.status === 'done';

  return (
    <article className="group border-b border-slate-100 px-3 py-2.5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-2.5">
          <button
            onClick={() => onToggleDone(task)}
            className={`mt-1 h-4 w-4 rounded-full border transition ${
              isDone ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-300 hover:border-slate-500'
            }`}
            aria-label="toggle done"
          >
            {isDone ? '✓' : ''}
          </button>
          <div className="min-w-0">
            <p className={`truncate text-sm ${isDone ? 'text-slate-400 line-through' : 'text-slate-800'}`}>{task.title}</p>
            <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs">
              {task.description && <span className="text-slate-400">{task.description}</span>}
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-slate-500">{priorityLabel[task.priority]}</span>
              <span className="text-slate-400">{task.projectName}</span>
              {task.tags.map((tag) => (
                <span key={tag} className="text-slate-400">
                  #{tag}
                </span>
              ))}
              <span className={overdue ? 'text-rose-500' : 'text-slate-500'}>
                {overdue ? `Overdue · ${formatTaskDateTime(task.dueDateTime)}` : formatTaskDateTime(task.dueDateTime)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 opacity-0 transition group-hover:opacity-100">
          <button onClick={() => onEdit(task)} className="rounded-lg px-2 py-1 text-xs text-slate-500 hover:bg-slate-100">
            编辑
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="rounded-lg px-2 py-1 text-xs text-rose-500 hover:bg-rose-50"
          >
            删除
          </button>
        </div>
      </div>
    </article>
  );
};

export default TaskItem;
