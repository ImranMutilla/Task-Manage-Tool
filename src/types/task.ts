export type TaskStatus = 'todo' | 'in-progress' | 'done';
export type TaskPriority = 'p1' | 'p2' | 'p3' | 'p4';

export interface Project {
  id: string;
  name: string;
  isSystem?: boolean;
}

export interface TagOption {
  id: string;
  name: string;
  colorClass: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDateTime?: string;
  projectId: string;
  projectName: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  isInInbox: boolean;
  isInToday: boolean;
  dueDate?: string;
}

export interface TaskSuggestion {
  recommendedPriority: TaskPriority;
  dueDateHint: string;
  splitIdeas: string[];
}

export type TaskSortBy = 'dueDateTime' | 'createdAt' | 'priority' | 'updatedAt';
export type DueState = 'all' | 'upcoming' | 'overdue' | 'no-date';

export interface TaskFilters {
  search: string;
  status: 'all' | TaskStatus;
  priority: 'all' | TaskPriority;
  projectId: 'all' | string;
  tag: 'all' | string;
  dueState: DueState;
  sortBy: TaskSortBy;
}

export type ViewKey = 'inbox' | 'today' | 'upcoming' | 'completed' | 'project' | 'tag';

export interface ActiveView {
  type: ViewKey;
  id?: string;
  label: string;
}

export interface TaskInput {
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  time?: string;
  projectId?: string;
  tags: string[];
  isInToday: boolean;
}
