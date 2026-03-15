import { useEffect, useRef, useState } from 'react';
import { Task } from '../types/task';
import { formatTaskDateTime } from '../utils/dateTime';
import { isOverdue, priorityMeta } from '../utils/taskUtils';
import TaskMetaRow from './TaskMetaRow';

interface TaskItemProps {
  task: Task;
  onToggleDone: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onDuplicate: (task: Task) => void;
  onOpenDetail: (task: Task) => void;
  onSetStatus?: (task: Task, status: Task['status']) => void;
  enableStatusMenu?: boolean;
  showOrganizeActions?: boolean;
}

const TaskItem = ({
  task,
  onToggleDone,
  onEdit,
  onDelete,
  onDuplicate,
  onOpenDetail,
  onSetStatus,
  enableStatusMenu = false,
  showOrganizeActions = false,
}: TaskItemProps) => {
  const isDone = task.status === 'done';
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;

    const onPointerDown = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [menuOpen]);

  const statusActions: Array<{ label: string; status: Task['status'] }> =
    task.status === 'todo'
      ? [
          { label: 'Mark as in progress', status: 'in-progress' },
          { label: 'Mark as done', status: 'done' },
        ]
      : task.status === 'in-progress'
        ? [
            { label: 'Mark as done', status: 'done' },
            { label: 'Move back to todo', status: 'todo' },
          ]
        : [{ label: 'Move back to todo', status: 'todo' }];

  return (
    <article className="group cursor-pointer rounded-xl px-2.5 py-2 transition hover:bg-slate-50" onClick={() => onOpenDetail(task)}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-2">
          <div className="relative" ref={menuRef}>
            <button
              onClick={(event) => {
                event.stopPropagation();
                if (enableStatusMenu && onSetStatus && task.status !== 'done') {
                  setMenuOpen((prev) => !prev);
                  return;
                }
                onToggleDone(task);
              }}
              className={`mt-1 h-4 w-4 rounded-full border text-[10px] ${
                isDone ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-300 hover:border-slate-500'
              }`}
              aria-label="toggle done"
            >
              {isDone ? '✓' : ''}
            </button>

            {menuOpen && onSetStatus && (
              <div className="absolute left-0 top-6 z-20 w-40 rounded-lg border border-slate-200 bg-white p-1 shadow-md" onClick={(event) => event.stopPropagation()}>
                {statusActions.map((action) => (
                  <button
                    key={action.label}
                    onClick={() => {
                      onSetStatus(task, action.status);
                      setMenuOpen(false);
                    }}
                    className="block w-full rounded-md px-2 py-1.5 text-left text-xs text-slate-600 hover:bg-slate-50"
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-1.5">
              <p className={`truncate text-sm font-medium ${isDone ? 'text-slate-400 line-through' : 'text-slate-800'}`}>{task.title}</p>
              <span className={isOverdue(task) ? 'text-xs text-rose-500' : 'text-xs text-slate-600'}>
                {formatTaskDateTime(task.dueDateTime, task.dueHasTime)}
              </span>
              <span className={`rounded-full px-1.5 py-0.5 text-[10px] ${priorityMeta[task.priority].className}`}>
                {priorityMeta[task.priority].short}
              </span>
            </div>
            <TaskMetaRow task={task} />
          </div>
        </div>

        <div className="flex items-center gap-1 opacity-0 transition group-hover:opacity-100">
          {showOrganizeActions && (
            <>
              <button onClick={(e) => { e.stopPropagation(); onEdit(task); }} className="rounded-lg px-1.5 py-1 text-[11px] text-slate-500 hover:bg-slate-100">Move to project</button>
              <button onClick={(e) => { e.stopPropagation(); onEdit(task); }} className="rounded-lg px-1.5 py-1 text-[11px] text-slate-500 hover:bg-slate-100">Set date</button>
              <button onClick={(e) => { e.stopPropagation(); onEdit(task); }} className="rounded-lg px-1.5 py-1 text-[11px] text-slate-500 hover:bg-slate-100">Set priority</button>
            </>
          )}
          <button onClick={(e) => { e.stopPropagation(); onEdit(task); }} className="rounded-lg px-1.5 py-1 text-[11px] text-slate-500 hover:bg-slate-100">Edit</button>
          <button onClick={(e) => { e.stopPropagation(); onDuplicate(task); }} className="rounded-lg px-1.5 py-1 text-[11px] text-slate-500 hover:bg-slate-100">Duplicate</button>
          <button onClick={(e) => { e.stopPropagation(); onDelete(task.id); }} className="rounded-lg px-1.5 py-1 text-[11px] text-rose-500 hover:bg-rose-50">Delete</button>
        </div>
      </div>
    </article>
  );
};

export default TaskItem;
