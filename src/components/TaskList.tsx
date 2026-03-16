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
  onSetStatus?: (task: Task, status: Task['status']) => void;
  enableStatusMenu?: boolean;
  showOrganizeActions?: boolean;
}

const TaskList = ({
  tasks,
  emptyMessage,
  onToggleDone,
  onEdit,
  onDelete,
  onDuplicate,
  onOpenDetail,
  onSetStatus,
  enableStatusMenu = false,
  showOrganizeActions = false,
}: TaskListProps) => {
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
          onSetStatus={onSetStatus}
          enableStatusMenu={enableStatusMenu}
          showOrganizeActions={showOrganizeActions}
        />
      ))}
    </section>
  );
};

export default TaskList;
