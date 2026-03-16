import { Task } from '../types/task';
import { formatTaskDateTime } from '../utils/dateTime';
import { getTagColorClass, priorityMeta } from '../utils/taskUtils';

interface TaskDetailPanelProps {
  task?: Task;
  onClose: () => void;
  onEdit: (task: Task) => void;
}

const TaskDetailPanel = ({ task, onClose, onEdit }: TaskDetailPanelProps) => {
  if (!task) return null;

  return (
    <aside className="fixed right-0 top-0 z-40 h-full w-full max-w-md border-l border-slate-200 bg-white p-5 shadow-2xl">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-semibold text-slate-900">Task details</h2>
        <button onClick={onClose} className="rounded-lg px-2 py-1 text-slate-500 hover:bg-slate-100">✕</button>
      </div>

      <div className="space-y-3 text-sm">
        <div><p className="text-xs text-slate-400">Title</p><p className="text-slate-800">{task.title}</p></div>
        <div><p className="text-xs text-slate-400">Description</p><p className="text-slate-700">{task.description || '—'}</p></div>
        <div className="flex flex-wrap gap-2">
          <span className={`rounded-full px-2 py-1 text-xs ${priorityMeta[task.priority].className}`}>{priorityMeta[task.priority].label}</span>
          <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600">{task.projectName}</span>
          <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600">{formatTaskDateTime(task.dueDateTime, task.dueHasTime)}</span>
          <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600">repeat: {task.repeat}</span>
          {task.tags.map((tag) => <span key={tag} className={`rounded-full px-2 py-1 text-xs ${getTagColorClass(tag)}`}>{tag}</span>)}
        </div>
        <div><p className="text-xs text-slate-400">Status</p><p>{task.status}</p></div>
        <div><p className="text-xs text-slate-400">Section</p><p>{task.section || '—'}</p></div>
        <div><p className="text-xs text-slate-400">Subtask of</p><p>{task.parentTaskId || '—'}</p></div>
        <div><p className="text-xs text-slate-400">Created</p><p>{new Date(task.createdAt).toLocaleString()}</p></div>
        <div><p className="text-xs text-slate-400">Updated</p><p>{new Date(task.updatedAt).toLocaleString()}</p></div>
      </div>

      <div className="mt-5">
        <button onClick={() => onEdit(task)} className="rounded-full bg-slate-900 px-3.5 py-1.5 text-sm text-white">Edit task</button>
      </div>
    </aside>
  );
};

export default TaskDetailPanel;
