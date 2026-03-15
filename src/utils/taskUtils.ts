import { ActiveView, Project, Task, TaskFilters, TaskInput, TaskPriority, TaskStatus, TaskSuggestion } from '../types/task';
import { isToday, startOfDay, toISODateTime } from './dateTime';

export const DEFAULT_PROJECTS: Project[] = [
  { id: 'inbox', name: 'Inbox', isSystem: true },
  { id: 'personal', name: 'Personal' },
  { id: 'work', name: 'Work' },
  { id: 'learning', name: 'Learning' },
  { id: 'shopping', name: 'Shopping' },
];

const priorityWeight: Record<TaskPriority, number> = {
  p1: 4,
  p2: 3,
  p3: 2,
  p4: 1,
};

export const priorityLabel: Record<TaskPriority, string> = {
  p1: 'P1',
  p2: 'P2',
  p3: 'P3',
  p4: 'P4',
};

export const statusLabel: Record<TaskStatus, string> = {
  todo: '待办',
  'in-progress': '进行中',
  done: '已完成',
};

export const getTaskSuggestion = (title: string): TaskSuggestion | null => {
  const normalized = title.trim().toLowerCase();
  if (!normalized) return null;

  if (normalized.includes('面试')) {
    return {
      recommendedPriority: 'p1',
      dueDateHint: '建议安排在本周并设置明确时间点。',
      splitIdeas: ['修改简历', '准备自我介绍', '梳理项目亮点', '模拟问答'],
    };
  }
  if (normalized.includes('客户') || normalized.includes('方案')) {
    return {
      recommendedPriority: 'p1',
      dueDateHint: '建议设置提交时间并预留复查窗口。',
      splitIdeas: ['明确目标', '整理素材', '形成初稿', '校对交付'],
    };
  }

  return {
    recommendedPriority: 'p2',
    dueDateHint: '建议补充日期与时间，执行更清晰。',
    splitIdeas: ['定义结果', '拆分步骤', '安排时间块'],
  };
};

export const isOverdue = (task: Task): boolean => {
  if (!task.dueDateTime || task.status === 'done') return false;
  return new Date(task.dueDateTime).getTime() < Date.now();
};

const includesKeyword = (task: Task, keyword: string): boolean => {
  if (!keyword) return true;
  const searchable = [task.title, task.description ?? '', task.projectName, task.tags.join(' ')].join(' ').toLowerCase();
  return searchable.includes(keyword);
};

const matchView = (task: Task, view: ActiveView): boolean => {
  if (view.type === 'inbox') return task.projectId === 'inbox' && task.status !== 'done';
  if (view.type === 'today') return task.status !== 'done' && (task.isInToday || isToday(task.dueDateTime));
  if (view.type === 'upcoming') return task.status !== 'done' && !!task.dueDateTime;
  if (view.type === 'completed') return task.status === 'done';
  if (view.type === 'project') return task.projectId === view.id;
  if (view.type === 'tag') return task.tags.includes(view.id ?? '');
  return true;
};

export const getVisibleTasks = (tasks: Task[], filters: TaskFilters, view: ActiveView): Task[] => {
  const keyword = filters.search.toLowerCase().trim();

  return tasks
    .filter((task) => {
      if (!matchView(task, view)) return false;
      if (filters.status !== 'all' && task.status !== filters.status) return false;
      if (filters.priority !== 'all' && task.priority !== filters.priority) return false;
      if (filters.projectId !== 'all' && task.projectId !== filters.projectId) return false;
      if (filters.tag !== 'all' && !task.tags.includes(filters.tag)) return false;
      if (filters.overdue === 'overdue' && !isOverdue(task)) return false;
      return includesKeyword(task, keyword);
    })
    .sort((a, b) => sortTasks(a, b, filters.sortBy, view));
};

const byDueDate = (a: Task, b: Task): number => {
  const aDue = a.dueDateTime ? new Date(a.dueDateTime).getTime() : Number.POSITIVE_INFINITY;
  const bDue = b.dueDateTime ? new Date(b.dueDateTime).getTime() : Number.POSITIVE_INFINITY;
  return aDue - bDue;
};

const sortTasks = (a: Task, b: Task, sortBy: TaskFilters['sortBy'], view: ActiveView): number => {
  if (view.type === 'completed') {
    return new Date(b.completedAt ?? b.updatedAt).getTime() - new Date(a.completedAt ?? a.updatedAt).getTime();
  }

  if (sortBy === 'createdAt') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  if (sortBy === 'updatedAt') return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  if (sortBy === 'priority') return priorityWeight[b.priority] - priorityWeight[a.priority];

  const dueOrder = byDueDate(a, b);
  if (dueOrder !== 0) return dueOrder;
  return priorityWeight[b.priority] - priorityWeight[a.priority];
};

export const getFocusTasks = (tasks: Task[]): Task[] => {
  const now = Date.now();

  return tasks
    .filter((task) => task.status !== 'done')
    .sort((a, b) => {
      const aOverdue = isOverdue(a) ? 1 : 0;
      const bOverdue = isOverdue(b) ? 1 : 0;
      if (aOverdue !== bOverdue) return bOverdue - aOverdue;

      const aToday = isToday(a.dueDateTime) ? 1 : 0;
      const bToday = isToday(b.dueDateTime) ? 1 : 0;
      if (aToday !== bToday) return bToday - aToday;

      const priorityDiff = priorityWeight[b.priority] - priorityWeight[a.priority];
      if (priorityDiff !== 0) return priorityDiff;

      const aDue = a.dueDateTime ? Math.abs(new Date(a.dueDateTime).getTime() - now) : Number.POSITIVE_INFINITY;
      const bDue = b.dueDateTime ? Math.abs(new Date(b.dueDateTime).getTime() - now) : Number.POSITIVE_INFINITY;
      return aDue - bDue;
    })
    .slice(0, 3);
};

export const getNextStatus = (status: TaskStatus): TaskStatus => {
  if (status === 'todo') return 'in-progress';
  if (status === 'in-progress') return 'done';
  return 'todo';
};

export const collectTags = (tasks: Task[]): string[] => {
  return [...new Set(tasks.flatMap((task) => task.tags))].sort((a, b) => a.localeCompare(b));
};

export const countsByProject = (tasks: Task[]): Record<string, number> => {
  return tasks.reduce<Record<string, number>>((acc, task) => {
    if (task.status !== 'done') {
      acc[task.projectId] = (acc[task.projectId] ?? 0) + 1;
    }
    return acc;
  }, {});
};

export const baseFilters: TaskFilters = {
  search: '',
  status: 'all',
  priority: 'all',
  projectId: 'all',
  tag: 'all',
  overdue: 'all',
  sortBy: 'dueDateTime',
};

export const buildTaskFromInput = (
  input: TaskInput,
  existing: Pick<Task, 'id' | 'createdAt'> | null,
  projectMap: Map<string, Project>,
): Task => {
  const now = new Date().toISOString();
  const project = projectMap.get(input.projectId ?? 'inbox') ?? projectMap.get('inbox');
  const dueDateTime = input.dueDate ? toISODateTime(input.dueDate, input.time) : undefined;

  return {
    id: existing?.id ?? crypto.randomUUID(),
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
    title: input.title.trim(),
    description: input.description?.trim() || undefined,
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
  const tomorrow = startOfDay(new Date(Date.now() + 24 * 60 * 60 * 1000)).getTime();
  const nextWeek = today + 7 * 24 * 60 * 60 * 1000;

  const groups: Array<{ label: string; test: (task: Task) => boolean }> = [
    { label: 'Today', test: (task) => !!task.dueDateTime && startOfDay(new Date(task.dueDateTime)).getTime() === today },
    {
      label: 'Tomorrow',
      test: (task) => !!task.dueDateTime && startOfDay(new Date(task.dueDateTime)).getTime() === tomorrow,
    },
    {
      label: 'Next 7 Days',
      test: (task) => {
        if (!task.dueDateTime) return false;
        const target = startOfDay(new Date(task.dueDateTime)).getTime();
        return target > tomorrow && target <= nextWeek;
      },
    },
    {
      label: 'Later',
      test: (task) => {
        if (!task.dueDateTime) return false;
        const target = startOfDay(new Date(task.dueDateTime)).getTime();
        return target > nextWeek;
      },
    },
  ];

  return groups
    .map((group) => ({ label: group.label, items: tasks.filter(group.test) }))
    .filter((group) => group.items.length > 0);
};
