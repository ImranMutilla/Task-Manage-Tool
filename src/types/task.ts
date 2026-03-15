export type TaskPriority = 'high' | 'medium' | 'low';
export type TaskStatus = 'todo' | 'in-progress' | 'done';

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: TaskPriority;
  dueDateTime?: string;
  /** @deprecated legacy compatibility field */
  dueDate?: string;
  status: TaskStatus;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface TaskSuggestion {
  recommendedPriority: TaskPriority;
  dueDateHint: string;
  splitIdeas: string[];
}

export interface TaskFilters {
  search: string;
  status: 'all' | TaskStatus;
  priority: 'all' | TaskPriority;
  sortBy: 'dueDateTime' | 'createdAt';
}

export interface TaskInput {
  title: string;
  description?: string;
  priority: TaskPriority;
  dueDateTime?: string;
  status: TaskStatus;
  tags: string[];
}
