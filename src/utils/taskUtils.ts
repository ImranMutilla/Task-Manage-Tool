import { ActiveView, Project, TagOption, Task, TaskFilters, TaskInput, TaskPriority, TaskRepeat, TaskSortBy, TaskStatus, TaskSuggestion, ViewKey } from '../types/task';
import { formatDateGroupTitle, isToday, startOfDay, toISODateTime, toLocalDateKey } from './dateTime';

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

const TAG_COLOR_POOL = [
  'bg-blue-100 text-blue-700',
  'bg-emerald-100 text-emerald-700',
  'bg-orange-100 text-orange-700',
  'bg-violet-100 text-violet-700',
  'bg-pink-100 text-pink-700',
  'bg-cyan-100 text-cyan-700',
  'bg-amber-100 text-amber-700',
  'bg-zinc-100 text-zinc-700',
];

export const tagColorMap = Object.fromEntries(DEFAULT_TAGS.map((tag) => [tag.name.toLowerCase(), tag.colorClass]));

export const getTagColorClass = (tagName: string): string => {
  const normalized = tagName.trim().toLowerCase();
  if (!normalized) return 'bg-slate-100 text-slate-600';
  if (tagColorMap[normalized]) return tagColorMap[normalized];

  let hash = 0;
  for (let i = 0; i < normalized.length; i += 1) hash = (hash * 31 + normalized.charCodeAt(i)) >>> 0;
  return TAG_COLOR_POOL[hash % TAG_COLOR_POOL.length];
};
const priorityWeight: Record<TaskPriority, number> = { p1: 4, p2: 3, p3: 2, p4: 1 };

export const priorityMeta: Record<TaskPriority, { label: string; short: string; className: string }> = {
  p1: { label: 'P1 · Critical', short: 'P1', className: 'bg-rose-100 text-rose-700 border border-rose-200' },
  p2: { label: 'P2 · High', short: 'P2', className: 'bg-orange-100 text-orange-700 border border-orange-200' },
  p3: { label: 'P3 · Medium', short: 'P3', className: 'bg-blue-100 text-blue-700 border border-blue-200' },
  p4: { label: 'P4 · Low', short: 'P4', className: 'bg-slate-100 text-slate-600 border border-slate-200' },
};

export const statusLabel: Record<TaskStatus, string> = { todo: '待办', 'in-progress': '进行中', done: '已完成' };


export interface QuickParseResult {
  cleanTitle: string;
  dueDate?: string;
  time?: string;
  repeat?: TaskRepeat;
  tags: string[];
  projectId?: string;
}

export const parseQuickTaskInput = (title: string, projects: Project[], knownTags: string[]): QuickParseResult => {
  const result: QuickParseResult = { cleanTitle: title.trim(), tags: [] };
  if (!result.cleanTitle) return result;

  let working = result.cleanTitle;

  const tomorrowTime = working.match(/\btomorrow\s+(\d{1,2})(?::(\d{2}))?\s*(am|pm)\b/i);
  if (tomorrowTime) {
    const hourRaw = Number(tomorrowTime[1]);
    const minute = tomorrowTime[2] ?? '00';
    const meridiem = tomorrowTime[3].toLowerCase();
    const hour24 = meridiem === 'pm' && hourRaw < 12 ? hourRaw + 12 : meridiem === 'am' && hourRaw === 12 ? 0 : hourRaw;
    const tomorrow = startOfDay(new Date());
    tomorrow.setDate(tomorrow.getDate() + 1);
    result.dueDate = tomorrow.toISOString().slice(0, 10);
    result.time = `${String(hour24).padStart(2, '0')}:${minute}`;
    working = working.replace(tomorrowTime[0], '').trim();
  } else if (/\btomorrow\b/i.test(working)) {
    const tomorrow = startOfDay(new Date());
    tomorrow.setDate(tomorrow.getDate() + 1);
    result.dueDate = tomorrow.toISOString().slice(0, 10);
    working = working.replace(/\btomorrow\b/ig, '').trim();
  }

  if (/\bevery\s+monday\b/i.test(working)) {
    result.repeat = 'weekly';
    working = working.replace(/\bevery\s+monday\b/ig, '').trim();
  }

  const projectToken = working.match(/#([\w-]+)/);
  if (projectToken) {
    const name = projectToken[1].toLowerCase();
    const project = projects.find((item) => item.name.toLowerCase() === name || item.id.toLowerCase() === name);
    if (project) {
      result.projectId = project.id;
      working = working.replace(projectToken[0], '').trim();
    }
  }

  const tagTokens = [...working.matchAll(/@([\w-]+)/g)];
  if (tagTokens.length) {
    const tagSet = new Set(knownTags.map((tag) => tag.toLowerCase()));
    for (const token of tagTokens) {
      const candidate = token[1];
      const matched = knownTags.find((tag) => tag.toLowerCase() === candidate.toLowerCase());
      if (matched) result.tags.push(matched);
      else if (!tagSet.has(candidate.toLowerCase())) result.tags.push(candidate);
    }
    working = working.replace(/@[\w-]+/g, '').trim();
  }

  result.cleanTitle = working.replace(/\s{2,}/g, ' ').trim() || title.trim();
  return result;
};

export const getTaskSuggestion = (title: string): TaskSuggestion | null => {
  const text = title.trim().toLowerCase();
  if (!text) return null;
  if (text.includes('面试')) return { recommendedPriority: 'p1', dueDateHint: '建议设定明确时间并倒排。', splitIdeas: ['简历', '自我介绍', '项目梳理'] };
  return { recommendedPriority: 'p2', dueDateHint: '建议补充截止时间。', splitIdeas: ['明确结果', '拆分步骤', '安排时间'] };
};

export const isOverdue = (task: Task): boolean => !!task.dueDateTime && task.status !== 'done' && new Date(task.dueDateTime).getTime() < Date.now();

const startTodayTs = (): number => startOfDay(new Date()).getTime();
const endUpcomingTs = (): number => startTodayTs() + 6 * 24 * 60 * 60 * 1000 + (24 * 60 * 60 * 1000 - 1);

export const isInboxTask = (task: Task): boolean => task.projectId === 'inbox' && task.status !== 'done';

export const isTodayTask = (task: Task): boolean => {
  if (task.status === 'done') return false;
  if (task.dueDateTime && isToday(task.dueDateTime)) return true;
  return Boolean(task.todayPinned && !task.dueDateTime);
};

export const isUpcomingTask = (task: Task): boolean => {
  if (task.status === 'done' || !task.dueDateTime) return false;
  const value = new Date(task.dueDateTime).getTime();
  return value >= startTodayTs() && value <= endUpcomingTs();
};

const matchesView = (task: Task, view: ActiveView): boolean => {
  if (view.type === 'inbox') return isInboxTask(task);
  if (view.type === 'today') return isTodayTask(task);
  if (view.type === 'upcoming') return isUpcomingTask(task);
  if (view.type === 'completed') return task.status === 'done';
  if (view.type === 'project') return task.projectId === view.id && task.status !== 'done';
  if (view.type === 'tag') return task.tags.includes(view.id ?? '') && task.status !== 'done';
  return true;
};

const matchesFilters = (task: Task, filters: TaskFilters): boolean => {
  if (filters.status !== 'all' && task.status !== filters.status) return false;
  if (filters.priority !== 'all' && task.priority !== filters.priority) return false;
  if (filters.projectId !== 'all' && task.projectId !== filters.projectId) return false;
  if (filters.tag !== 'all' && !task.tags.includes(filters.tag)) return false;

  if (filters.dueState === 'overdue' && !isOverdue(task)) return false;
  if (filters.dueState === 'upcoming' && !isUpcomingTask(task)) return false;
  if (filters.dueState === 'no-date' && task.dueDateTime) return false;

  const keyword = filters.search.trim().toLowerCase();
  if (keyword) {
    const hay = `${task.title} ${task.description ?? ''} ${task.projectName} ${task.tags.join(' ')}`.toLowerCase();
    if (!hay.includes(keyword)) return false;
  }

  return true;
};

const sortByMode = (a: Task, b: Task, sortBy: TaskFilters['sortBy'], _activeView: ActiveView): number => {
  if (sortBy === 'createdAt') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  if (sortBy === 'updatedAt') return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  if (sortBy === 'priority') return priorityWeight[b.priority] - priorityWeight[a.priority];
  if (sortBy === 'completedAt') return new Date(b.completedAt ?? b.updatedAt).getTime() - new Date(a.completedAt ?? a.updatedAt).getTime();

  const aDue = a.dueDateTime ? new Date(a.dueDateTime).getTime() : Number.POSITIVE_INFINITY;
  const bDue = b.dueDateTime ? new Date(b.dueDateTime).getTime() : Number.POSITIVE_INFINITY;
  if (aDue === bDue) return priorityWeight[b.priority] - priorityWeight[a.priority];
  return aDue - bDue;
};

export const getVisibleTasks = (tasks: Task[], filters: TaskFilters, view: ActiveView): Task[] => {
  return tasks
    .filter((task) => matchesView(task, view))
    .filter((task) => matchesFilters(task, filters))
    .sort((a, b) => sortByMode(a, b, filters.sortBy, view));
};

export const getViewCounts = (tasks: Task[]) => {
  return {
    inbox: tasks.filter((task) => isInboxTask(task)).length,
    today: tasks.filter((task) => isTodayTask(task)).length,
    upcoming: tasks.filter((task) => isUpcomingTask(task)).length,
    completed: tasks.filter((task) => task.status === 'done').length,
  };
};

export const getUpNextTask = (tasks: Task[]): Task | undefined => {
  return tasks
    .filter((task) => task.status !== 'done' && (isTodayTask(task) || isOverdue(task)))
    .sort((a, b) => {
      const ao = isOverdue(a) ? 1 : 0;
      const bo = isOverdue(b) ? 1 : 0;
      if (ao !== bo) return bo - ao;

      if (a.priority !== b.priority) return priorityWeight[b.priority] - priorityWeight[a.priority];

      const at = a.dueDateTime ? new Date(a.dueDateTime).getTime() : Number.POSITIVE_INFINITY;
      const bt = b.dueDateTime ? new Date(b.dueDateTime).getTime() : Number.POSITIVE_INFINITY;
      return at - bt;
    })[0];
};

export const collectTags = (tasks: Task[]): string[] => [...new Set([...DEFAULT_TAGS.map((t) => t.name), ...tasks.flatMap((t) => t.tags)])];

export const countsByProject = (tasks: Task[]): Record<string, number> =>
  tasks.reduce<Record<string, number>>((acc, task) => {
    if (task.status !== 'done') acc[task.projectId] = (acc[task.projectId] ?? 0) + 1;
    return acc;
  }, {});


export interface ToolbarConfig {
  searchPlaceholder: string;
  visibleFilters: Array<'search' | 'status' | 'priority' | 'project' | 'tag' | 'dueState'>;
  sortOptions: TaskSortBy[];
  defaultSort: TaskSortBy;
  sortLabelOverrides?: Partial<Record<TaskSortBy, string>>;
}

const viewToolbarConfig: Record<ViewKey, ToolbarConfig> = {
  inbox: {
    searchPlaceholder: 'Search inbox tasks',
    visibleFilters: ['search', 'priority', 'tag'],
    sortOptions: ['createdAt', 'dueDateTime', 'priority', 'updatedAt'],
    defaultSort: 'createdAt',
  },
  today: {
    searchPlaceholder: 'Search today tasks',
    visibleFilters: ['search', 'priority', 'tag'],
    sortOptions: ['dueDateTime', 'priority'],
    defaultSort: 'dueDateTime',
    sortLabelOverrides: { dueDateTime: 'Due time' },
  },
  upcoming: {
    searchPlaceholder: 'Search upcoming tasks',
    visibleFilters: ['search', 'priority', 'project', 'tag'],
    sortOptions: ['dueDateTime', 'priority'],
    defaultSort: 'dueDateTime',
  },
  completed: {
    searchPlaceholder: 'Search completed tasks',
    visibleFilters: ['search', 'project', 'tag'],
    sortOptions: ['completedAt', 'dueDateTime', 'priority'],
    defaultSort: 'completedAt',
  },
  project: {
    searchPlaceholder: 'Search project tasks',
    visibleFilters: ['search', 'status', 'priority', 'tag'],
    sortOptions: ['dueDateTime', 'priority', 'updatedAt'],
    defaultSort: 'dueDateTime',
  },
  tag: {
    searchPlaceholder: 'Search tagged tasks',
    visibleFilters: ['search', 'status', 'priority', 'project'],
    sortOptions: ['dueDateTime', 'priority', 'updatedAt'],
    defaultSort: 'dueDateTime',
  },
};

export const getToolbarConfig = (view: ActiveView): ToolbarConfig => viewToolbarConfig[view.type];

export const sanitizeFiltersForView = (filters: TaskFilters, config: ToolbarConfig): TaskFilters => {
  const next: TaskFilters = { ...filters };

  if (!config.visibleFilters.includes('status')) next.status = 'all';
  if (!config.visibleFilters.includes('priority')) next.priority = 'all';
  if (!config.visibleFilters.includes('project')) next.projectId = 'all';
  if (!config.visibleFilters.includes('tag')) next.tag = 'all';
  if (!config.visibleFilters.includes('dueState')) next.dueState = 'all';

  if (!config.sortOptions.includes(next.sortBy)) next.sortBy = config.defaultSort;

  return next;
};

export const baseFilters: TaskFilters = {
  search: '',
  status: 'all',
  priority: 'all',
  projectId: 'all',
  tag: 'all',
  dueState: 'all',
  sortBy: 'dueDateTime',
};

export const buildTaskFromInput = (input: TaskInput, existing: Pick<Task, 'id' | 'createdAt'> | null, projectMap: Map<string, Project>): Task => {
  const now = new Date().toISOString();
  const project = projectMap.get(input.projectId ?? 'inbox') ?? projectMap.get('inbox');
  const due = input.dueDate ? toISODateTime(input.dueDate, input.time) : undefined;

  return {
    id: existing?.id ?? crypto.randomUUID(),
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
    title: input.title,
    description: input.description,
    status: input.status,
    priority: input.priority,
    dueDateTime: due?.iso,
    dueHasTime: due?.hasTime,
    projectId: project?.id ?? 'inbox',
    projectName: project?.name ?? 'Inbox',
    tags: input.tags,
    completedAt: input.status === 'done' ? now : undefined,
    todayPinned: input.todayPinned,
    repeat: input.repeat,
    section: input.section,
    parentTaskId: input.parentTaskId,
  };
};


export const getUpcomingWindowTasks = (tasks: Task[], filters: TaskFilters, weekOffset: number): Task[] => {
  const windowStart = startOfDay(new Date());
  windowStart.setDate(windowStart.getDate() + weekOffset * 7);
  const windowEnd = new Date(windowStart);
  windowEnd.setDate(windowStart.getDate() + 6);
  windowEnd.setHours(23, 59, 59, 999);

  return tasks
    .filter((task) => task.status !== 'done' && task.dueDateTime)
    .filter((task) => {
      const due = new Date(task.dueDateTime!).getTime();
      return due >= windowStart.getTime() && due <= windowEnd.getTime();
    })
    .filter((task) => matchesFilters(task, filters))
    .sort((a, b) => sortByMode(a, b, filters.sortBy, { type: 'upcoming', label: 'Upcoming' }));
};

export const groupUpcomingByDate = (tasks: Task[], weekOffset: number): Array<{ date: string; label: string; items: Task[] }> => {
  const start = startOfDay(new Date());
  start.setDate(start.getDate() + weekOffset * 7);

  const groups: Array<{ date: string; label: string; items: Task[] }> = [];
  for (let i = 0; i < 7; i += 1) {
    const day = new Date(start);
    day.setDate(start.getDate() + i);
    const key = toLocalDateKey(day);

    const dayItems = tasks
      .filter((task) => task.dueDateTime && toLocalDateKey(task.dueDateTime) === key)
      .sort((a, b) => {
        const aHasTime = a.dueHasTime ? 1 : 0;
        const bHasTime = b.dueHasTime ? 1 : 0;
        if (aHasTime !== bHasTime) return bHasTime - aHasTime;

        const aTime = a.dueDateTime ? new Date(a.dueDateTime).getTime() : Number.POSITIVE_INFINITY;
        const bTime = b.dueDateTime ? new Date(b.dueDateTime).getTime() : Number.POSITIVE_INFINITY;
        if (aTime !== bTime) return aTime - bTime;

        return priorityWeight[b.priority] - priorityWeight[a.priority];
      });

    groups.push({ date: key, label: formatDateGroupTitle(day), items: dayItems });
  }

  return groups;
};

export const splitTodaySections = (tasks: Task[]) => {
  const candidates = tasks.filter((task) => task.status !== 'done' && (isTodayTask(task) || isOverdue(task)));

  const overdue = candidates
    .filter((task) => isOverdue(task))
    .sort((a, b) => new Date(a.dueDateTime!).getTime() - new Date(b.dueDateTime!).getTime());

  const dueToday = candidates
    .filter((task) => !isOverdue(task) && task.dueDateTime && isToday(task.dueDateTime))
    .sort((a, b) => new Date(a.dueDateTime!).getTime() - new Date(b.dueDateTime!).getTime());

  const flexible = candidates.filter((task) => !task.dueDateTime && task.todayPinned);

  return { overdue, dueToday, flexible };
};
