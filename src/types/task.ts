export type TaskPriority = 'high' | 'medium' | 'low';
export type TaskStatus = 'todo' | 'in-progress' | 'done';

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: TaskPriority;
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
  sortBy: 'dueDate' | 'createdAt';
}
