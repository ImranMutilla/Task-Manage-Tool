import { Task } from '../types/task';
import { getTagColorClass } from '../utils/taskUtils';

interface TaskMetaRowProps {
  task: Task;
}

const TaskMetaRow = ({ task }: TaskMetaRowProps) => {
  return (
    <div className="mt-1.5 flex flex-wrap items-center gap-1.5 text-[11px] text-slate-500">
      <span className="text-slate-400">{task.projectName}</span>
      {task.section && <span className="rounded-full bg-slate-100 px-1.5 py-0.5 text-slate-500">§ {task.section}</span>}
      {task.parentTaskId && <span className="rounded-full bg-slate-100 px-1.5 py-0.5 text-slate-500">Subtask</span>}
      {task.repeat !== 'none' && <span className="rounded-full bg-slate-100 px-1.5 py-0.5 text-slate-500">↻ {task.repeat}</span>}
      {task.tags.map((tag) => (
        <span key={tag} className={`rounded-full px-1.5 py-0.5 ${getTagColorClass(tag)} opacity-80`}>
          {tag}
        </span>
      ))}
      {task.status === 'done' && task.completedAt && <span className="text-slate-400">Completed {new Date(task.completedAt).toLocaleString()}</span>}
      {task.description && <span className="truncate text-slate-400">{task.description}</span>}
    </div>
  );
};

export default TaskMetaRow;
