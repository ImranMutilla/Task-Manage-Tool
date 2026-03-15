import { FormEvent, useMemo, useState } from 'react';
import { Project, Task, TaskInput, TaskPriority, TaskSuggestion, TimeParts } from '../types/task';
import { fromISOToDate, fromISOToTimeParts } from '../utils/dateTime';
import { getTaskSuggestion, priorityLabel } from '../utils/taskUtils';
import DatePicker from './DatePicker';
import TimePicker15Min from './TimePicker15Min';

interface TaskComposerProps {
  mode: 'create' | 'edit';
  projects: Project[];
  initialTask?: Task;
  onSubmit: (payload: TaskInput) => void;
  onCancel: () => void;
}

const TaskComposer = ({ mode, projects, initialTask, onSubmit, onCancel }: TaskComposerProps) => {
  const [title, setTitle] = useState(initialTask?.title ?? '');
  const [description, setDescription] = useState(initialTask?.description ?? '');
  const [priority, setPriority] = useState<TaskPriority>(initialTask?.priority ?? 'p2');
  const [projectId, setProjectId] = useState(initialTask?.projectId ?? 'inbox');
  const [tags, setTags] = useState((initialTask?.tags ?? []).join(', '));
  const [status, setStatus] = useState<Task['status']>(initialTask?.status ?? 'todo');
  const [isInToday, setIsInToday] = useState(initialTask?.isInToday ?? false);
  const [dueDate, setDueDate] = useState(fromISOToDate(initialTask?.dueDateTime));
  const [time, setTime] = useState<TimeParts | undefined>(fromISOToTimeParts(initialTask?.dueDateTime));

  const suggestion: TaskSuggestion | null = useMemo(() => getTaskSuggestion(title), [title]);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!title.trim()) return;

    onSubmit({
      title: title.trim(),
      description: description.trim() || undefined,
      priority,
      status,
      dueDate: dueDate || undefined,
      time,
      projectId,
      isInToday,
      tags: tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
    });
  };

  return (
    <form onSubmit={submit} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
      <h2 className="text-lg font-semibold text-slate-900">{mode === 'create' ? 'Add task' : 'Edit task'}</h2>
      <div className="mt-3 space-y-3">
        <input
          autoFocus
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Task title"
          className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-slate-400"
          required
        />

        <textarea
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Description (optional)"
          className="min-h-20 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-slate-400"
        />

        <div className="grid grid-cols-1 gap-2 md:grid-cols-5">
          <DatePicker value={dueDate} onChange={setDueDate} />
          <TimePicker15Min value={time} onChange={setTime} />
          <select
            value={priority}
            onChange={(event) => setPriority(event.target.value as TaskPriority)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
          >
            <option value="p1">P1</option>
            <option value="p2">P2</option>
            <option value="p3">P3</option>
            <option value="p4">P4</option>
          </select>
          <input
            value={tags}
            onChange={(event) => setTags(event.target.value)}
            placeholder="tags, comma"
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
          />
          <select
            value={projectId}
            onChange={(event) => setProjectId(event.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
          >
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value as Task['status'])}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs"
          >
            <option value="todo">待办</option>
            <option value="in-progress">进行中</option>
            <option value="done">已完成</option>
          </select>
          <label className="flex items-center gap-1 rounded-xl border border-slate-200 px-2 py-1.5">
            <input type="checkbox" checked={isInToday} onChange={(event) => setIsInToday(event.target.checked)} />
            Add to Today
          </label>
        </div>

        {suggestion && (
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-600">
            <p className="font-medium text-slate-800">Smart hint · {priorityLabel[suggestion.recommendedPriority]}</p>
            <p>{suggestion.dueDateHint}</p>
          </div>
        )}

        <div className="flex justify-end gap-2 pt-1">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full border border-slate-300 px-4 py-1.5 text-sm text-slate-600"
          >
            Cancel
          </button>
          <button type="submit" className="rounded-full bg-slate-900 px-4 py-1.5 text-sm text-white">
            {mode === 'create' ? 'Add task' : 'Save changes'}
          </button>
        </div>
      </div>
    </form>
  );
};

export default TaskComposer;
