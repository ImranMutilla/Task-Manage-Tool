import { Task } from '../types/task';
import { getNextStatus, isOverdue, priorityLabel, statusLabel } from '../utils/taskUtils';

interface TaskCardProps {
  task: Task;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: Task['status']) => void;
  onEdit: (task: Task) => void;
}

const priorityStyle: Record<Task['priority'], string> = {
  high: 'bg-rose-50 text-rose-700',
  medium: 'bg-amber-50 text-amber-700',
  low: 'bg-emerald-50 text-emerald-700',
};

const TaskCard = ({ task, onDelete, onStatusChange, onEdit }: TaskCardProps) => {
  return (
    <article
      className={`rounded-xl border p-4 shadow-sm transition hover:shadow ${
        isOverdue(task) ? 'border-rose-200 bg-rose-50/60' : 'border-slate-200 bg-white'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-slate-800">{task.title}</h3>
          {task.description && <p className="mt-1 text-sm text-slate-600">{task.description}</p>}
        </div>
        <span className={`rounded-full px-2 py-1 text-xs font-medium ${priorityStyle[task.priority]}`}>
          {priorityLabel[task.priority]}
        </span>
      </div>

      <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-600">
        <span className="rounded-full bg-slate-100 px-2 py-1">状态：{statusLabel[task.status]}</span>
        <span className="rounded-full bg-slate-100 px-2 py-1">截止：{task.dueDate ?? '未设置'}</span>
        {task.tags.length > 0 && <span className="rounded-full bg-slate-100 px-2 py-1">标签：{task.tags.join(' · ')}</span>}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          onClick={() => onStatusChange(task.id, getNextStatus(task.status))}
          className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-500"
        >
          切换状态
        </button>
        <button
          onClick={() => onStatusChange(task.id, 'done')}
          className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 hover:bg-emerald-100"
        >
          标记完成
        </button>
        <button
          onClick={() => onEdit(task)}
          className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100"
        >
          编辑
        </button>
        <button
          onClick={() => onDelete(task.id)}
          className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-medium text-rose-700 hover:bg-rose-100"
        >
          删除
        </button>
      </div>
    </article>
  );
};

export default TaskCard;
