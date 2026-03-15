import { Task } from '../types/task';
import TaskItem from './TaskItem';

interface TaskListProps {
  tasks: Task[];
  emptyMessage: string;
  onToggleDone: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

const TaskList = ({ tasks, emptyMessage, onToggleDone, onEdit, onDelete }: TaskListProps) => {
  if (!tasks.length) {
    return (
      <section className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center text-sm text-slate-500">
        {emptyMessage}
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} onToggleDone={onToggleDone} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </section>
  );
};

export default TaskList;
