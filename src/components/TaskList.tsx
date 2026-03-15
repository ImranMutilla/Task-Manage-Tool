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
      <section className="rounded-2xl bg-white p-8 text-center text-sm text-slate-500 shadow-sm">
        暂无匹配任务。你可以先创建任务，或者调整搜索筛选条件。
      </section>
    );
  }

  return (
    <section className="grid gap-3">
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} onDelete={onDelete} onStatusChange={onStatusChange} onEdit={onEdit} />
      ))}
    </section>
  );
};

export default TaskList;
