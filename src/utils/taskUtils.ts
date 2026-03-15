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

export const isOverdue = (task: Task): boolean => {
  if (!task.dueDate || task.status === 'done') return false;
  const due = new Date(task.dueDate).getTime();
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  return due < today.getTime();
};

export const getFilteredTasks = (tasks: Task[], filters: TaskFilters): Task[] => {
  return tasks
    .filter((task) => {
      const matchSearch = task.title.toLowerCase().includes(filters.search.toLowerCase().trim());
      const matchStatus = filters.status === 'all' || task.status === filters.status;
      const matchPriority = filters.priority === 'all' || task.priority === filters.priority;
      return matchSearch && matchStatus && matchPriority;
    })
    .sort((a, b) => {
      if (filters.sortBy === 'createdAt') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }

      const aDue = a.dueDate ? new Date(a.dueDate).getTime() : Number.POSITIVE_INFINITY;
      const bDue = b.dueDate ? new Date(b.dueDate).getTime() : Number.POSITIVE_INFINITY;
      if (aDue === bDue) {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      return aDue - bDue;
    });
};

export const getFocusTask = (tasks: Task[]): Task | null => {
  const candidates = tasks.filter((task) => task.status !== 'done');
  if (candidates.length === 0) return null;

  return candidates.sort((a, b) => {
    const aDue = a.dueDate ? new Date(a.dueDate).getTime() : Number.POSITIVE_INFINITY;
    const bDue = b.dueDate ? new Date(b.dueDate).getTime() : Number.POSITIVE_INFINITY;

    const dueScore = aDue - bDue;
    if (dueScore !== 0) return dueScore;

    const priorityScore = priorityWeight[b.priority] - priorityWeight[a.priority];
    if (priorityScore !== 0) return priorityScore;

    return statusWeight[b.status] - statusWeight[a.status];
  })[0];
};

export const getTaskSuggestion = (title: string): TaskSuggestion | null => {
  const normalized = title.trim().toLowerCase();
  if (!normalized) return null;

  if (normalized.includes('面试')) {
    return {
      recommendedPriority: 'high',
      dueDateHint: '建议在 3-5 天内设置截止日期，便于倒排准备节奏。',
      splitIdeas: ['修改简历', '准备自我介绍', '整理项目经验', '模拟常见问题'],
    };
  }

  if (normalized.includes('客户') || normalized.includes('方案')) {
    return {
      recommendedPriority: 'high',
      dueDateHint: '建议设置明确截止日期，并在提交前预留 1 天校对。',
      splitIdeas: ['确认客户目标', '收集数据与案例', '整理方案结构', '制作汇报版本'],
    };
  }

  if (normalized.includes('报税') || normalized.includes('材料')) {
    return {
      recommendedPriority: 'medium',
      dueDateHint: '建议尽早设置截止日期，避免临近截止日资料不齐。',
      splitIdeas: ['整理票据', '核对收入支出', '准备申报信息', '最终复查并提交'],
    };
  }

  if (normalized.length <= 4) {
    return {
      recommendedPriority: 'medium',
      dueDateHint: '任务较模糊，建议补充截止日期与成功标准。',
      splitIdeas: ['明确目标结果', '拆分 2-3 个可执行步骤', '为每个步骤设置完成标记'],
    };
  }

  return {
    recommendedPriority: 'medium',
    dueDateHint: '建议根据任务影响范围决定是否设置截止日期。',
    splitIdeas: ['明确产出物', '拆分关键步骤', '安排执行时间段'],
  };
};

export const getNextStatus = (status: TaskStatus): TaskStatus => {
  if (status === 'todo') return 'in-progress';
  if (status === 'in-progress') return 'done';
  return 'todo';
};
