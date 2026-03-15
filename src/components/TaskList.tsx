import { Task } from '../types/task';
import TaskCard from './TaskCard';

interface TaskListProps {
  tasks: Task[];
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: Task['status']) => void;
  onEdit: (task: Task) => void;
}

const TaskList = ({ tasks, onDelete, onStatusChange, onEdit }: TaskListProps) => {
  if (tasks.length === 0) {
    return (
      <section className="rounded-3xl border border-dashed border-slate-300 bg-white/70 p-10 text-center shadow-[0_20px_50px_-45px_rgba(15,23,42,0.45)]">
        <p className="text-sm text-slate-500">No matching tasks. Try changing filters or create a new one.</p>
      </section>
    );
  }

  return (
    <section className="grid gap-3.5">
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} onDelete={onDelete} onStatusChange={onStatusChange} onEdit={onEdit} />
      ))}
    </section>
  );
};

export default TaskList;
