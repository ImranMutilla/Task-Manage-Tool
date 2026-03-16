import { Project, TagOption, Task, TaskPriority, TaskRepeat, TaskStatus } from '../types/task';
import { DEFAULT_PROJECTS, DEFAULT_TAGS, getTagColorClass } from '../utils/taskUtils';

const TASKS_KEY = 'smart_task_assistant_tasks';
const PROJECTS_KEY = 'smart_task_assistant_projects';
const TAGS_KEY = 'smart_task_assistant_tags';

const mapLegacyPriority = (priority?: string): TaskPriority => {
  if (priority === 'p1' || priority === 'p2' || priority === 'p3' || priority === 'p4') return priority;
  if (priority === 'high') return 'p1';
  if (priority === 'medium') return 'p2';
  if (priority === 'low') return 'p4';
  return 'p3';
};

const mapRepeat = (repeat?: string): TaskRepeat => {
  if (repeat === 'daily' || repeat === 'weekday' || repeat === 'weekly' || repeat === 'monthly') return repeat;
  return 'none';
};

const normalizeTask = (raw: unknown): Task | null => {
  if (!raw || typeof raw !== 'object') return null;
  const task = raw as Partial<Task> & { dueDate?: string; priority?: string; status?: string; repeat?: string };
  if (!task.id || !task.title) return null;

  const fromLegacyDate = Boolean(!task.dueDateTime && task.dueDate);
  const dueDateTime = task.dueDateTime ?? (task.dueDate ? `${task.dueDate}T09:00:00.000Z` : undefined);
  const projectId = task.projectId ?? 'inbox';
  const projectName = task.projectName ?? DEFAULT_PROJECTS.find((project) => project.id === projectId)?.name ?? 'Inbox';
  const status: TaskStatus =
    task.status === 'todo' || task.status === 'in-progress' || task.status === 'done' ? task.status : 'todo';

  const updatedAt = task.updatedAt ? String(task.updatedAt) : new Date().toISOString();

  return {
    id: String(task.id),
    title: String(task.title),
    description: task.description ? String(task.description) : undefined,
    status,
    priority: mapLegacyPriority(task.priority),
    dueDateTime: dueDateTime ? String(dueDateTime) : undefined,
    dueHasTime: task.dueHasTime ?? (fromLegacyDate ? false : Boolean(dueDateTime)),
    projectId,
    projectName,
    tags: Array.isArray(task.tags) ? task.tags.map(String) : [],
    createdAt: task.createdAt ? String(task.createdAt) : updatedAt,
    updatedAt,
    completedAt: status === 'done' ? String(task.completedAt ?? updatedAt) : undefined,
    todayPinned: Boolean(task.todayPinned ?? task.isInToday),
    repeat: mapRepeat(task.repeat),
    section: task.section ? String(task.section) : undefined,
    parentTaskId: task.parentTaskId ? String(task.parentTaskId) : undefined,
  };
};

export const loadTasks = (): Task[] => {
  try {
    const raw = localStorage.getItem(TASKS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown[];
    if (!Array.isArray(parsed)) return [];
    return parsed.map((item) => normalizeTask(item)).filter((task): task is Task => task !== null);
  } catch {
    return [];
  }
};

export const saveTasks = (tasks: Task[]): void => {
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
};

const normalizeProject = (raw: unknown): Project | null => {
  if (!raw || typeof raw !== 'object') return null;
  const project = raw as Partial<Project>;
  if (!project.id || !project.name) return null;
  return { id: String(project.id), name: String(project.name), isSystem: Boolean(project.isSystem) };
};

export const loadProjects = (): Project[] => {
  try {
    const raw = localStorage.getItem(PROJECTS_KEY);
    if (!raw) return DEFAULT_PROJECTS;
    const parsed = JSON.parse(raw) as unknown[];
    if (!Array.isArray(parsed)) return DEFAULT_PROJECTS;
    const projects = parsed.map((item) => normalizeProject(item)).filter((project): project is Project => project !== null);
    const map = new Map(projects.map((project) => [project.id, project]));
    for (const defaultProject of DEFAULT_PROJECTS) if (!map.has(defaultProject.id)) map.set(defaultProject.id, defaultProject);
    return [...map.values()];
  } catch {
    return DEFAULT_PROJECTS;
  }
};

export const saveProjects = (projects: Project[]): void => {
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
};


const normalizeTag = (raw: unknown): TagOption | null => {
  if (!raw || typeof raw !== 'object') return null;
  const tag = raw as Partial<TagOption> & { color?: string; label?: string };
  const name = tag.name ?? tag.label;
  if (!name) return null;
  const id = tag.id ?? String(name).toLowerCase().replace(/\s+/g, '-');
  const defaultTag = DEFAULT_TAGS.find((item) => item.name.toLowerCase() === String(name).toLowerCase());
  return {
    id: String(id),
    name: String(name),
    colorClass: tag.colorClass ? String(tag.colorClass) : defaultTag?.colorClass ?? getTagColorClass(String(name)),
  };
};

export const loadTags = (): TagOption[] => {
  try {
    const raw = localStorage.getItem(TAGS_KEY);
    if (!raw) return DEFAULT_TAGS;
    const parsed = JSON.parse(raw) as unknown[];
    if (!Array.isArray(parsed)) return DEFAULT_TAGS;
    const tags = parsed.map((item) => normalizeTag(item)).filter((tag): tag is TagOption => tag !== null);
    const map = new Map(tags.map((tag) => [tag.name.toLowerCase(), tag]));
    for (const defaultTag of DEFAULT_TAGS) if (!map.has(defaultTag.name.toLowerCase())) map.set(defaultTag.name.toLowerCase(), defaultTag);
    return [...map.values()];
  } catch {
    return DEFAULT_TAGS;
  }
};

export const saveTags = (tags: TagOption[]): void => {
  localStorage.setItem(TAGS_KEY, JSON.stringify(tags));
};
