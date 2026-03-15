import { Task, TaskFilters, TaskPriority, TaskStatus, TaskSuggestion } from '../types/task';

const priorityWeight: Record<TaskPriority, number> = {
  high: 3,
  medium: 2,
  low: 1,
};

const statusWeight: Record<TaskStatus, number> = {
  todo: 2,
  'in-progress': 1,
  done: 0,
};

export const statusLabel: Record<TaskStatus, string> = {
  todo: '待办',
  'in-progress': '进行中',
  done: '已完成',
};

export const priorityLabel: Record<TaskPriority, string> = {
  high: '高',
  medium: '中',
  low: '低',
};

export const getDueTimestamp = (task: Task): number => {
  if (!task.dueDateTime) return Number.POSITIVE_INFINITY;
  return new Date(task.dueDateTime).getTime();
};

export const isOverdue = (task: Task): boolean => {
  if (!task.dueDateTime || task.status === 'done') return false;
  return getDueTimestamp(task) < Date.now();
};

export const formatDueDateTime = (dueDateTime?: string): string => {
  if (!dueDateTime) return 'No deadline';
  const date = new Date(dueDateTime);
  if (Number.isNaN(date.getTime())) return 'Invalid date';

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
};

export const getFilteredTasks = (tasks: Task[], filters: TaskFilters): Task[] => {
  return tasks
    .filter((task) => {
      const keyword = filters.search.toLowerCase().trim();
      const matchSearch =
        task.title.toLowerCase().includes(keyword) || task.tags.join(' ').toLowerCase().includes(keyword);
      const matchStatus = filters.status === 'all' || task.status === filters.status;
      const matchPriority = filters.priority === 'all' || task.priority === filters.priority;
      return matchSearch && matchStatus && matchPriority;
    })
    .sort((a, b) => {
      if (filters.sortBy === 'createdAt') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }

      const dueDiff = getDueTimestamp(a) - getDueTimestamp(b);
      if (dueDiff !== 0) return dueDiff;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
};

export const getFocusTask = (tasks: Task[]): Task | null => {
  const candidates = tasks.filter((task) => task.status !== 'done');
  if (!candidates.length) return null;

  return [...candidates].sort((a, b) => {
    const statusDiff = statusWeight[b.status] - statusWeight[a.status];
    if (statusDiff !== 0) return statusDiff;

    const priorityDiff = priorityWeight[b.priority] - priorityWeight[a.priority];
    if (priorityDiff !== 0) return priorityDiff;

    const dueDiff = getDueTimestamp(a) - getDueTimestamp(b);
    if (dueDiff !== 0) return dueDiff;

    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  })[0];
};

export const getTaskSuggestion = (title: string): TaskSuggestion | null => {
  const normalized = title.trim().toLowerCase();
  if (!normalized) return null;

  if (normalized.includes('面试')) {
    return {
      recommendedPriority: 'high',
      dueDateHint: '建议在本周内设置明确时间点，例如面试前一天 18:30 完成复盘。',
      splitIdeas: ['修改简历', '准备自我介绍', '整理项目经验', '模拟常见问题'],
    };
  }

  if (normalized.includes('客户') || normalized.includes('方案')) {
    return {
      recommendedPriority: 'high',
      dueDateHint: '建议设置具体提交时间，并预留至少 2 小时用于最终校对。',
      splitIdeas: ['确认客户目标', '收集数据与案例', '整理方案结构', '制作汇报版本'],
    };
  }

  if (normalized.includes('报税') || normalized.includes('材料')) {
    return {
      recommendedPriority: 'medium',
      dueDateHint: '建议尽早设定具体提交时刻，避免在截止日最后时段处理。',
      splitIdeas: ['整理票据', '核对收入支出', '准备申报信息', '最终复查并提交'],
    };
  }

  return {
    recommendedPriority: 'medium',
    dueDateHint: '建议补充可执行时间点（例如本周五 16:00）以增强可执行性。',
    splitIdeas: ['明确产出物', '拆分关键步骤', '安排执行时间段'],
  };
};

export const getNextStatus = (status: TaskStatus): TaskStatus => {
  if (status === 'todo') return 'in-progress';
  if (status === 'in-progress') return 'done';
  return 'todo';
};
