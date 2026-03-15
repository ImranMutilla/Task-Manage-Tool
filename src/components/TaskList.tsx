import { Task } from '../types/task';
import TaskItem from './TaskItem';

interface TaskListProps {
  tasks: Task[];
  emptyMessage: string;
  onToggleDone: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onDuplicate: (task: Task) => void;
  onOpenDetail: (task: Task) => void;
}

const TaskList = ({ tasks, emptyMessage, onToggleDone, onEdit, onDelete, onDuplicate, onOpenDetail }: TaskListProps) => {
  if (!tasks.length) {
    return <p className="px-2 py-2 text-sm text-slate-400">{emptyMessage}</p>;
  }

  return (
    <section className="space-y-0.5">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggleDone={onToggleDone}
          onEdit={onEdit}
          onDelete={onDelete}
          onDuplicate={onDuplicate}
          onOpenDetail={onOpenDetail}
        />
      ))}
    </section>
  );
};

export default TaskList;
