import { FormEvent, useMemo, useState } from 'react';
import { Task, TaskPriority, TaskSuggestion } from '../types/task';
import { getTaskSuggestion, priorityLabel } from '../utils/taskUtils';

interface TaskFormProps {
  onAddTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

const TaskForm = ({ onAddTask }: TaskFormProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [dueDate, setDueDate] = useState('');
  const [tags, setTags] = useState('');
  const [status, setStatus] = useState<Task['status']>('todo');

  const suggestion: TaskSuggestion | null = useMemo(() => getTaskSuggestion(title), [title]);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!title.trim()) return;

    onAddTask({
      title: title.trim(),
      description: description.trim() || undefined,
      priority,
      dueDate: dueDate || undefined,
      status,
      tags: tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
    });

    setTitle('');
    setDescription('');
    setPriority('medium');
    setDueDate('');
    setStatus('todo');
    setTags('');
  };

  return (
    <section className="rounded-2xl bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-800">新建任务</h2>
      <p className="mb-4 mt-1 text-sm text-slate-500">快速记录并安排任务优先级。</p>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="例如：准备面试"
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none ring-indigo-100 focus:ring"
          required
        />
        <textarea
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="任务描述（可选）"
          className="min-h-20 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none ring-indigo-100 focus:ring"
        />

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <select
            value={priority}
            onChange={(event) => setPriority(event.target.value as TaskPriority)}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none ring-indigo-100 focus:ring"
          >
            <option value="high">高优先级</option>
            <option value="medium">中优先级</option>
            <option value="low">低优先级</option>
          </select>

          <select
            value={status}
            onChange={(event) => setStatus(event.target.value as Task['status'])}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none ring-indigo-100 focus:ring"
          >
            <option value="todo">待办</option>
            <option value="in-progress">进行中</option>
            <option value="done">已完成</option>
          </select>
        </div>

        <input
          type="date"
          value={dueDate}
          onChange={(event) => setDueDate(event.target.value)}
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none ring-indigo-100 focus:ring"
        />

        <input
          value={tags}
          onChange={(event) => setTags(event.target.value)}
          placeholder="标签，逗号分隔（可选）"
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none ring-indigo-100 focus:ring"
        />

        <button
          type="submit"
          className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-500"
        >
          添加任务
        </button>
      </form>

      {suggestion && (
        <div className="mt-4 rounded-lg border border-indigo-100 bg-indigo-50 p-3 text-xs text-indigo-900">
          <p className="font-semibold">智能建议</p>
          <p className="mt-1">推荐优先级：{priorityLabel[suggestion.recommendedPriority]}</p>
          <p className="mt-1">截止日期建议：{suggestion.dueDateHint}</p>
          <p className="mt-1">推荐拆分：</p>
          <ul className="ml-4 list-disc space-y-1">
            {suggestion.splitIdeas.map((idea) => (
              <li key={idea}>{idea}</li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
};

export default TaskForm;
