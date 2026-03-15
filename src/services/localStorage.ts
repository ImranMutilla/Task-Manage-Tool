import { Task } from '../types/task';

const TASKS_KEY = 'smart_task_assistant_tasks';

const normalizeDueDateTime = (task: Task): Task => {
  if (task.dueDateTime) return task;
  if (task.dueDate) {
    return {
      ...task,
      dueDateTime: `${task.dueDate}T18:00`,
    };
  }
  return task;
};

const normalizeTaskShape = (raw: unknown): Task | null => {
  if (!raw || typeof raw !== 'object') return null;
  const task = raw as Partial<Task>;
  if (!task.id || !task.title || !task.priority || !task.status || !task.createdAt || !task.updatedAt) {
    return null;
  }

  return normalizeDueDateTime({
    id: String(task.id),
    title: String(task.title),
    description: task.description ? String(task.description) : undefined,
    priority: task.priority,
    status: task.status,
    dueDateTime: task.dueDateTime ? String(task.dueDateTime) : undefined,
    dueDate: task.dueDate ? String(task.dueDate) : undefined,
    tags: Array.isArray(task.tags) ? task.tags.map(String) : [],
    createdAt: String(task.createdAt),
    updatedAt: String(task.updatedAt),
  });
};

export const loadTasks = (): Task[] => {
  try {
    const raw = localStorage.getItem(TASKS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown[];
    if (!Array.isArray(parsed)) return [];

    return parsed
      .map((item) => normalizeTaskShape(item))
      .filter((task): task is Task => task !== null);
  } catch {
    return [];
  }
};

export const saveTasks = (tasks: Task[]): void => {
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
};
