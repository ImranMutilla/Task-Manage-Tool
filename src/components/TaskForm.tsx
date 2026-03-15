import { FormEvent, useMemo, useState } from 'react';
import { Task, TaskInput, TaskPriority, TaskSuggestion } from '../types/task';
import { getTaskSuggestion, priorityLabel } from '../utils/taskUtils';

interface TaskFormProps {
  mode: 'create' | 'edit';
  initialValues?: Task;
  onSubmitTask: (task: TaskInput) => void;
  onCancel: () => void;
}

const TaskForm = ({ mode, initialValues, onSubmitTask, onCancel }: TaskFormProps) => {
  const [title, setTitle] = useState(initialValues?.title ?? '');
  const [description, setDescription] = useState(initialValues?.description ?? '');
  const [priority, setPriority] = useState<TaskPriority>(initialValues?.priority ?? 'medium');
  const [dueDateTime, setDueDateTime] = useState(initialValues?.dueDateTime ?? '');
  const [tags, setTags] = useState((initialValues?.tags ?? []).join(', '));
  const [status, setStatus] = useState<Task['status']>(initialValues?.status ?? 'todo');

  const suggestion: TaskSuggestion | null = useMemo(() => getTaskSuggestion(title), [title]);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!title.trim()) return;

    onSubmitTask({
      title: title.trim(),
      description: description.trim() || undefined,
      priority,
      dueDateTime: dueDateTime || undefined,
      status,
      tags: tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
    });
  };

  return (
    <section className="rounded-3xl border border-black/5 bg-white/95 p-6 shadow-[0_24px_80px_-40px_rgba(15,23,42,0.35)] backdrop-blur">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-slate-900">
            {mode === 'create' ? 'Create Task' : 'Edit Task'}
          </h2>
          <p className="mt-1 text-sm text-slate-500">Use a clear title and exact due time to improve focus quality.</p>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-600 transition hover:bg-slate-50"
        >
          关闭
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-medium uppercase tracking-wider text-slate-500">Title</label>
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="例如：准备面试"
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-slate-300 focus:ring-2 focus:ring-slate-200"
            required
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium uppercase tracking-wider text-slate-500">Description</label>
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="任务描述（可选）"
            className="min-h-24 w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-slate-300 focus:ring-2 focus:ring-slate-200"
          />
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-xs font-medium uppercase tracking-wider text-slate-500">Priority</label>
            <select
              value={priority}
              onChange={(event) => setPriority(event.target.value as TaskPriority)}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-slate-300 focus:ring-2 focus:ring-slate-200"
            >
              <option value="high">高优先级</option>
              <option value="medium">中优先级</option>
              <option value="low">低优先级</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium uppercase tracking-wider text-slate-500">Status</label>
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value as Task['status'])}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-slate-300 focus:ring-2 focus:ring-slate-200"
            >
              <option value="todo">待办</option>
              <option value="in-progress">进行中</option>
              <option value="done">已完成</option>
            </select>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium uppercase tracking-wider text-slate-500">Due Date & Time</label>
          <input
            type="datetime-local"
            value={dueDateTime}
            onChange={(event) => setDueDateTime(event.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-slate-300 focus:ring-2 focus:ring-slate-200"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium uppercase tracking-wider text-slate-500">Tags</label>
          <input
            value={tags}
            onChange={(event) => setTags(event.target.value)}
            placeholder="标签，逗号分隔"
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-slate-300 focus:ring-2 focus:ring-slate-200"
          />
        </div>

        {suggestion && (
          <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-3 text-xs text-slate-700">
            <p className="font-medium text-slate-900">Smart suggestion</p>
            <p className="mt-1">推荐优先级：{priorityLabel[suggestion.recommendedPriority]}</p>
            <p className="mt-1">时间建议：{suggestion.dueDateHint}</p>
            <p className="mt-1">建议拆分：{suggestion.splitIdeas.join(' · ')}</p>
          </div>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-600 transition hover:bg-slate-50"
          >
            取消
          </button>
          <button
            type="submit"
            className="rounded-full bg-slate-900 px-5 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
          >
            {mode === 'create' ? '保存任务' : '更新任务'}
          </button>
        </div>
      </form>
    </section>
  );
};

export default TaskForm;
