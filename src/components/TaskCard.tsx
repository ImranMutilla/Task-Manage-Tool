import { Task } from '../types/task';
import {
  formatDueDateTime,
  getNextStatus,
  isOverdue,
  priorityLabel,
  statusLabel,
} from '../utils/taskUtils';

interface TaskCardProps {
  task: Task;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: Task['status']) => void;
  onEdit: (task: Task) => void;
}

const priorityStyle: Record<Task['priority'], string> = {
  high: 'bg-slate-900 text-white',
  medium: 'bg-slate-200 text-slate-700',
  low: 'bg-slate-100 text-slate-600',
};

const TaskCard = ({ task, onDelete, onStatusChange, onEdit }: TaskCardProps) => {
  return (
    <article
      className={`rounded-3xl border bg-white/90 p-5 shadow-[0_24px_80px_-50px_rgba(15,23,42,0.45)] backdrop-blur transition hover:-translate-y-0.5 ${
        isOverdue(task) ? 'border-rose-200' : 'border-black/5'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold tracking-tight text-slate-900">{task.title}</h3>
          {task.description && <p className="text-sm text-slate-500">{task.description}</p>}
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-medium ${priorityStyle[task.priority]}`}>
          {priorityLabel[task.priority]}
        </span>
      </div>

      <div className="mt-4 grid gap-2 text-xs text-slate-600 sm:grid-cols-2">
        <span className="rounded-2xl bg-slate-100/90 px-3 py-1.5">状态 · {statusLabel[task.status]}</span>
        <span className="rounded-2xl bg-slate-100/90 px-3 py-1.5">截止 · {formatDueDateTime(task.dueDateTime)}</span>
        {task.tags.length > 0 && (
          <span className="rounded-2xl bg-slate-100/90 px-3 py-1.5 sm:col-span-2">标签 · {task.tags.join(' · ')}</span>
        )}
        {isOverdue(task) && <span className="rounded-2xl bg-rose-50 px-3 py-1.5 text-rose-700">已逾期（精确到分钟）</span>}
      </div>

      <div className="mt-5 flex flex-wrap gap-2.5">
        <button
          onClick={() => onStatusChange(task.id, getNextStatus(task.status))}
          className="rounded-full border border-slate-200 px-3.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
        >
          切换状态
        </button>
        <button
          onClick={() => onStatusChange(task.id, 'done')}
          className="rounded-full border border-slate-200 px-3.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
        >
          标记完成
        </button>
        <button
          onClick={() => onEdit(task)}
          className="rounded-full bg-slate-900 px-3.5 py-1.5 text-xs font-medium text-white hover:bg-slate-700"
        >
          编辑
        </button>
        <button
          onClick={() => onDelete(task.id)}
          className="rounded-full border border-rose-200 px-3.5 py-1.5 text-xs font-medium text-rose-700 hover:bg-rose-50"
        >
          删除
        </button>
      </div>
    </article>
  );
};

export default TaskCard;
