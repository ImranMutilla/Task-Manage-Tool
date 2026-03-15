export type TaskStatus = 'todo' | 'in-progress' | 'done';
export type TaskPriority = 'p1' | 'p2' | 'p3' | 'p4';

export interface Project {
  id: string;
  name: string;
  isSystem?: boolean;
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
  /** legacy compatibility */
  dueDate?: string;
}

export interface TaskSuggestion {
  recommendedPriority: TaskPriority;
  dueDateHint: string;
  splitIdeas: string[];
}

export type TaskSortBy = 'dueDateTime' | 'createdAt' | 'priority' | 'updatedAt';

export interface TaskFilters {
  search: string;
  status: 'all' | TaskStatus;
  priority: 'all' | TaskPriority;
  projectId: 'all' | string;
  tag: 'all' | string;
  overdue: 'all' | 'overdue';
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
  time?: TimeParts;
  projectId?: string;
  tags: string[];
  isInToday: boolean;
}

export interface TimeParts {
  hour: string;
  minute: '00' | '15' | '30' | '45';
  period: 'AM' | 'PM';
}
