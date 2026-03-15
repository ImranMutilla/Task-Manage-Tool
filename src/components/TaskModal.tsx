import { Project, Task, TaskInput } from '../types/task';
import TaskComposer from './TaskComposer';

interface TaskModalProps {
  open: boolean;
  mode: 'create' | 'edit';
  projects: Project[];
  initialTask?: Task;
  presetDate?: string;
  onSubmit: (payload: TaskInput) => void;
  onClose: () => void;
}

const TaskModal = ({ open, mode, projects, initialTask, presetDate, onSubmit, onClose }: TaskModalProps) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/20 p-4 backdrop-blur-sm">
      <div className="w-full max-w-3xl">
        <TaskComposer mode={mode} projects={projects} initialTask={initialTask} presetDate={presetDate} onSubmit={onSubmit} onCancel={onClose} />
      </div>
    </div>
  );
};

export default TaskModal;
