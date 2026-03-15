import { Task } from '../types/task';
import { formatTaskDateTime } from '../utils/dateTime';
import { isOverdue, priorityMeta, tagColorMap } from '../utils/taskUtils';

interface TaskMetaRowProps {
  task: Task;
}

const TaskMetaRow = ({ task }: TaskMetaRowProps) => {
  return (
    <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs">
      <span className="text-slate-500">{task.projectName}</span>
      <span className={isOverdue(task) ? 'text-rose-500' : 'text-slate-500'}>{formatTaskDateTime(task.dueDateTime)}</span>
      <span className={`rounded-full px-2 py-0.5 ${priorityMeta[task.priority].className}`}>{priorityMeta[task.priority].short}</span>
      {task.tags.map((tag) => (
        <span key={tag} className={`rounded-full px-2 py-0.5 ${tagColorMap[tag] ?? 'bg-slate-100 text-slate-600'}`}>
          {tag}
        </span>
      ))}
      {task.description && <span className="text-slate-400">{task.description}</span>}
    </div>
  );
};

export default TaskMetaRow;
