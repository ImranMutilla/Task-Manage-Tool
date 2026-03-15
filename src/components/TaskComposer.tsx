import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Project, Task, TaskInput, TaskPriority, TaskRepeat } from '../types/task';
import { fromISOToDate, fromISOToTimeValue } from '../utils/dateTime';
import { DEFAULT_TAGS, getTaskSuggestion, priorityMeta } from '../utils/taskUtils';
import DatePickerQuick from './DatePickerQuick';
import PriorityPicker from './PriorityPicker';
import ProjectPicker from './ProjectPicker';
import TagPicker from './TagPicker';
import TimePicker15MinList from './TimePicker15MinList';

interface TaskComposerProps {
  mode: 'create' | 'edit';
  projects: Project[];
  initialTask?: Task;
  presetDate?: string;
  onSubmit: (payload: TaskInput) => void;
  onCancel: () => void;
}

const TaskComposer = ({ mode, projects, initialTask, presetDate, onSubmit, onCancel }: TaskComposerProps) => {
  const [title, setTitle] = useState(initialTask?.title ?? '');
  const [description, setDescription] = useState(initialTask?.description ?? '');
  const [priority, setPriority] = useState<TaskPriority>(initialTask?.priority ?? 'p3');
  const [projectId, setProjectId] = useState(initialTask?.projectId ?? 'inbox');
  const [status, setStatus] = useState<Task['status']>(initialTask?.status ?? 'todo');
  const [isInToday, setIsInToday] = useState(initialTask?.isInToday ?? Boolean(presetDate));
  const [dueDate, setDueDate] = useState(initialTask?.dueDateTime ? fromISOToDate(initialTask.dueDateTime) : presetDate ?? '');
  const [timeValue, setTimeValue] = useState(fromISOToTimeValue(initialTask?.dueDateTime, initialTask?.dueHasTime));
  const [tags, setTags] = useState<string[]>(initialTask?.tags ?? []);
  const [repeat, setRepeat] = useState<TaskRepeat>(initialTask?.repeat ?? 'none');

  useEffect(() => {
    const onEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onCancel();
    };
    window.addEventListener('keydown', onEsc);
    return () => window.removeEventListener('keydown', onEsc);
  }, [onCancel]);

  const suggestion = useMemo(() => getTaskSuggestion(title), [title]);
  const selectedProject = projects.find((project) => project.id === projectId)?.name ?? 'Inbox';

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!title.trim()) return;
    onSubmit({
      title: title.trim(),
      description: description.trim() || undefined,
      priority,
      status,
      dueDate: dueDate || undefined,
      time: timeValue || undefined,
      projectId,
      tags,
      isInToday,
      repeat,
    });
  };

  return (
    <form onSubmit={submit} className="w-full rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-base font-semibold text-slate-900">Add task</h2>
        <button type="button" onClick={onCancel} className="rounded-lg px-2 py-1 text-slate-500 hover:bg-slate-100">✕</button>
      </div>

      <div className="space-y-3">
        <input autoFocus value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Task name" className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm" required />
        <textarea value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Description (optional)" className="min-h-20 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-600" />

        <div className="flex flex-wrap items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-2">
          <DatePickerQuick value={dueDate} onChange={setDueDate} />
          <TimePicker15MinList value={timeValue} onChange={(value) => setTimeValue(value ?? '')} />
          <PriorityPicker value={priority} onChange={setPriority} />
          <ProjectPicker value={projectId} projects={projects} onChange={setProjectId} />
          <TagPicker selected={tags} options={DEFAULT_TAGS} onChange={setTags} />
          <select value={repeat} onChange={(event) => setRepeat(event.target.value as TaskRepeat)} className="rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-xs text-slate-700">
            <option value="none">Does not repeat</option>
            <option value="daily">Daily</option>
            <option value="weekday">Every weekday</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500">
          <label className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2 py-1">
            <input type="checkbox" checked={isInToday} onChange={(event) => setIsInToday(event.target.checked)} /> Add to Today
          </label>
          <select value={status} onChange={(event) => setStatus(event.target.value as Task['status'])} className="rounded-lg border border-slate-200 bg-white px-2 py-1">
            <option value="todo">Todo</option><option value="in-progress">In Progress</option><option value="done">Done</option>
          </select>
        </div>

        {suggestion && <div className="rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-600"><p className="font-medium text-slate-800">Suggested priority: {priorityMeta[suggestion.recommendedPriority].label}</p><p>{suggestion.dueDateHint}</p></div>}

        <div className="flex items-center justify-between border-t border-slate-100 pt-3">
          <p className="text-xs text-slate-500">Task will be added to: {selectedProject}</p>
          <div className="flex gap-2">
            <button type="button" onClick={onCancel} className="rounded-full border border-slate-300 px-3.5 py-1.5 text-sm">Cancel</button>
            <button type="submit" disabled={!title.trim()} className="rounded-full bg-slate-900 px-3.5 py-1.5 text-sm text-white disabled:opacity-50">{mode === 'create' ? 'Add task' : 'Save task'}</button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default TaskComposer;
