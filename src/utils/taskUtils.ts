import { ActiveView, Project, TagOption, Task, TaskFilters, TaskInput, TaskPriority, TaskStatus, TaskSuggestion } from '../types/task';
import { isToday, startOfDay, toISODateTime } from './dateTime';

export const DEFAULT_PROJECTS: Project[] = [
  { id: 'inbox', name: 'Inbox', isSystem: true },
  { id: 'personal', name: 'Personal' },
  { id: 'work', name: 'Work' },
  { id: 'learning', name: 'Learning' },
  { id: 'shopping', name: 'Shopping' },
];

export const DEFAULT_TAGS: TagOption[] = [
  { id: 'urgent', name: 'Urgent', colorClass: 'bg-rose-100 text-rose-700' },
  { id: 'follow-up', name: 'Follow-up', colorClass: 'bg-blue-100 text-blue-700' },
  { id: 'meeting', name: 'Meeting', colorClass: 'bg-violet-100 text-violet-700' },
  { id: 'work', name: 'Work', colorClass: 'bg-slate-200 text-slate-700' },
  { id: 'personal', name: 'Personal', colorClass: 'bg-emerald-100 text-emerald-700' },
  { id: 'study', name: 'Study', colorClass: 'bg-amber-100 text-amber-700' },
  { id: 'shopping', name: 'Shopping', colorClass: 'bg-orange-100 text-orange-700' },
  { id: 'important', name: 'Important', colorClass: 'bg-red-100 text-red-700' },
  { id: 'low-energy', name: 'Low energy', colorClass: 'bg-zinc-100 text-zinc-700' },
  { id: 'quick-task', name: 'Quick task', colorClass: 'bg-cyan-100 text-cyan-700' },
];

export const tagColorMap = Object.fromEntries(DEFAULT_TAGS.map((tag) => [tag.name, tag.colorClass]));

const priorityWeight: Record<TaskPriority, number> = { p1: 4, p2: 3, p3: 2, p4: 1 };

export const priorityMeta: Record<TaskPriority, { label: string; short: string; className: string }> = {
  p1: { label: 'P1 · Critical', short: 'P1', className: 'bg-rose-100 text-rose-700 border border-rose-200' },
  p2: { label: 'P2 · High', short: 'P2', className: 'bg-orange-100 text-orange-700 border border-orange-200' },
  p3: { label: 'P3 · Medium', short: 'P3', className: 'bg-blue-100 text-blue-700 border border-blue-200' },
  p4: { label: 'P4 · Low', short: 'P4', className: 'bg-slate-100 text-slate-600 border border-slate-200' },
};

export const statusLabel: Record<TaskStatus, string> = {
  todo: '待办',
  'in-progress': '进行中',
  done: '已完成',
};

export const getTaskSuggestion = (title: string): TaskSuggestion | null => {
  const text = title.trim().toLowerCase();
  if (!text) return null;
  if (text.includes('面试')) return { recommendedPriority: 'p1', dueDateHint: '建议设定明确时间并倒排。', splitIdeas: ['简历', '自我介绍', '项目梳理'] };
  return { recommendedPriority: 'p2', dueDateHint: '建议补充截止时间。', splitIdeas: ['明确结果', '拆分步骤', '安排时间'] };
};

export const isOverdue = (task: Task): boolean => !!task.dueDateTime && task.status !== 'done' && new Date(task.dueDateTime).getTime() < Date.now();

const matchesView = (task: Task, view: ActiveView): boolean => {
  if (view.type === 'inbox') return task.projectId === 'inbox' && task.status !== 'done';
  if (view.type === 'today') return task.status !== 'done' && (task.isInToday || isToday(task.dueDateTime));
  if (view.type === 'upcoming') return task.status !== 'done' && !!task.dueDateTime;
  if (view.type === 'completed') return task.status === 'done';
  if (view.type === 'project') return task.projectId === view.id;
  if (view.type === 'tag') return task.tags.includes(view.id ?? '');
  return true;
};

export const getVisibleTasks = (tasks: Task[], filters: TaskFilters, view: ActiveView): Task[] => {
  const keyword = filters.search.trim().toLowerCase();
  return tasks
    .filter((task) => {
      if (!matchesView(task, view)) return false;
      if (filters.status !== 'all' && task.status !== filters.status) return false;
      if (filters.priority !== 'all' && task.priority !== filters.priority) return false;
      if (filters.projectId !== 'all' && task.projectId !== filters.projectId) return false;
      if (filters.tag !== 'all' && !task.tags.includes(filters.tag)) return false;
      if (filters.dueState === 'overdue' && !isOverdue(task)) return false;
      if (filters.dueState === 'upcoming' && (!task.dueDateTime || isOverdue(task))) return false;
      if (filters.dueState === 'no-date' && task.dueDateTime) return false;
      if (keyword) {
        const hay = `${task.title} ${task.description ?? ''} ${task.projectName} ${task.tags.join(' ')}`.toLowerCase();
        if (!hay.includes(keyword)) return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (view.type === 'completed') return new Date(b.completedAt ?? b.updatedAt).getTime() - new Date(a.completedAt ?? a.updatedAt).getTime();
      if (filters.sortBy === 'createdAt') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (filters.sortBy === 'updatedAt') return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      if (filters.sortBy === 'priority') return priorityWeight[b.priority] - priorityWeight[a.priority];
      const aDue = a.dueDateTime ? new Date(a.dueDateTime).getTime() : Number.POSITIVE_INFINITY;
      const bDue = b.dueDateTime ? new Date(b.dueDateTime).getTime() : Number.POSITIVE_INFINITY;
      return aDue - bDue;
    });
};

export const getFocusTasks = (tasks: Task[]): Task[] => {
  const now = Date.now();
  return tasks
    .filter((task) => task.status !== 'done')
    .sort((a, b) => {
      const ao = isOverdue(a) ? 1 : 0;
      const bo = isOverdue(b) ? 1 : 0;
      if (ao !== bo) return bo - ao;
      const at = isToday(a.dueDateTime) ? 1 : 0;
      const bt = isToday(b.dueDateTime) ? 1 : 0;
      if (at !== bt) return bt - at;
      const p = priorityWeight[b.priority] - priorityWeight[a.priority];
      if (p !== 0) return p;
      const ad = a.dueDateTime ? Math.abs(new Date(a.dueDateTime).getTime() - now) : Number.POSITIVE_INFINITY;
      const bd = b.dueDateTime ? Math.abs(new Date(b.dueDateTime).getTime() - now) : Number.POSITIVE_INFINITY;
      return ad - bd;
    })
    .slice(0, 3);
};

export const collectTags = (tasks: Task[]): string[] => [...new Set([...DEFAULT_TAGS.map((t) => t.name), ...tasks.flatMap((t) => t.tags)])];

export const countsByProject = (tasks: Task[]): Record<string, number> =>
  tasks.reduce<Record<string, number>>((acc, task) => {
    if (task.status !== 'done') acc[task.projectId] = (acc[task.projectId] ?? 0) + 1;
    return acc;
  }, {});

export const baseFilters: TaskFilters = {
  search: '', status: 'all', priority: 'all', projectId: 'all', tag: 'all', dueState: 'all', sortBy: 'dueDateTime',
};

export const buildTaskFromInput = (input: TaskInput, existing: Pick<Task, 'id' | 'createdAt'> | null, projectMap: Map<string, Project>): Task => {
  const now = new Date().toISOString();
  const project = projectMap.get(input.projectId ?? 'inbox') ?? projectMap.get('inbox');
  const dueDateTime = input.dueDate ? toISODateTime(input.dueDate, input.time) : undefined;
  return {
    id: existing?.id ?? crypto.randomUUID(),
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
    title: input.title,
    description: input.description,
    status: input.status,
    priority: input.priority,
    dueDateTime,
    projectId: project?.id ?? 'inbox',
    projectName: project?.name ?? 'Inbox',
    tags: input.tags,
    completedAt: input.status === 'done' ? now : undefined,
    isInInbox: (project?.id ?? 'inbox') === 'inbox',
    isInToday: input.isInToday,
  };
};

export const splitUpcomingGroups = (tasks: Task[]): Array<{ label: string; items: Task[] }> => {
  const today = startOfDay(new Date()).getTime();
  const tomorrow = startOfDay(new Date(Date.now() + 86400000)).getTime();
  const nextWeek = today + 7 * 86400000;
  const groups = [
    { label: 'Today', test: (task: Task) => task.dueDateTime && startOfDay(new Date(task.dueDateTime)).getTime() === today },
    { label: 'Tomorrow', test: (task: Task) => task.dueDateTime && startOfDay(new Date(task.dueDateTime)).getTime() === tomorrow },
    { label: 'Next 7 Days', test: (task: Task) => { if (!task.dueDateTime) return false; const v=startOfDay(new Date(task.dueDateTime)).getTime(); return v>tomorrow && v<=nextWeek; } },
    { label: 'Later', test: (task: Task) => !!task.dueDateTime && startOfDay(new Date(task.dueDateTime)).getTime() > nextWeek },
  ];
  return groups.map((g) => ({ label: g.label, items: tasks.filter((task) => g.test(task)) })).filter((g) => g.items.length);
};
