import { Task } from '../types/task';
import { isOverdue, priorityLabel, statusLabel } from '../utils/taskUtils';

interface FocusPanelProps {
  task: Task | null;
}

const FocusPanel = ({ task }: FocusPanelProps) => {
  return (
    <section className="rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-600 to-violet-600 p-5 text-white shadow-sm">
      <h2 className="text-lg font-semibold">Today&apos;s Focus</h2>
      <p className="text-sm text-indigo-100">系统已为你挑选当前最该优先处理的任务。</p>

      {task ? (
        <div className="mt-3 rounded-xl bg-white/10 p-4 text-sm backdrop-blur-sm">
          <p className="text-base font-semibold">{task.title}</p>
          {task.description && <p className="mt-1 text-indigo-50">{task.description}</p>}
          <div className="mt-2 flex flex-wrap gap-2 text-xs">
            <span className="rounded-full bg-white/20 px-2 py-1">优先级：{priorityLabel[task.priority]}</span>
            <span className="rounded-full bg-white/20 px-2 py-1">状态：{statusLabel[task.status]}</span>
            <span className="rounded-full bg-white/20 px-2 py-1">
              截止：{task.dueDate ? task.dueDate : '未设置'}
            </span>
            {isOverdue(task) && <span className="rounded-full bg-rose-500 px-2 py-1">已逾期</span>}
          </div>
        </div>
      ) : (
        <div className="mt-3 rounded-xl bg-white/10 p-4 text-sm text-indigo-50">当前没有待处理任务，继续保持！</div>
      )}
    </section>
  );
};

export default FocusPanel;
