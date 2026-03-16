import { Project, TaskFilters, TaskSortBy } from '../types/task';
import { ToolbarConfig } from '../utils/taskUtils';

interface TaskFiltersProps {
  filters: TaskFilters;
  projects: Project[];
  tags: string[];
  config: ToolbarConfig;
  onChange: (next: TaskFilters) => void;
}

const sortLabel: Record<TaskSortBy, string> = {
  dueDateTime: 'Due date',
  priority: 'Priority',
  updatedAt: 'Recently updated',
  createdAt: 'Recently added',
  completedAt: 'Recently completed',
};

const inputClass = 'rounded-lg border border-slate-200/80 bg-white px-2.5 py-1.5 text-xs text-slate-600';

const TaskFiltersBar = ({ filters, projects, tags, config, onChange }: TaskFiltersProps) => {
  const getSortLabel = (sortOption: TaskSortBy) => config.sortLabelOverrides?.[sortOption] ?? sortLabel[sortOption];

  return (
    <section className="rounded-xl bg-white/80 px-3 py-2">
      <div className="mb-2 flex items-center justify-between text-xs text-slate-500">
        <span>Sorted by: {getSortLabel(filters.sortBy)}</span>
      </div>

      <div className="grid grid-cols-1 gap-2 md:grid-cols-7">
        {config.visibleFilters.includes('search') && (
          <input
            id="task-search-input"
            value={filters.search}
            onChange={(event) => onChange({ ...filters, search: event.target.value })}
            placeholder={config.searchPlaceholder}
            className={`${inputClass} md:col-span-2`}
          />
        )}
        {config.visibleFilters.includes('status') && (
          <select value={filters.status} onChange={(event) => onChange({ ...filters, status: event.target.value as TaskFilters['status'] })} className={inputClass}>
            <option value="all">Status</option><option value="todo">Todo</option><option value="in-progress">In progress</option><option value="done">Done</option>
          </select>
        )}
        {config.visibleFilters.includes('priority') && (
          <select value={filters.priority} onChange={(event) => onChange({ ...filters, priority: event.target.value as TaskFilters['priority'] })} className={inputClass}>
            <option value="all">Priority</option><option value="p1">P1</option><option value="p2">P2</option><option value="p3">P3</option><option value="p4">P4</option>
          </select>
        )}
        {config.visibleFilters.includes('project') && (
          <select value={filters.projectId} onChange={(event) => onChange({ ...filters, projectId: event.target.value })} className={inputClass}>
            <option value="all">Project</option>{projects.map((project) => <option key={project.id} value={project.id}>{project.name}</option>)}
          </select>
        )}
        {config.visibleFilters.includes('tag') && (
          <select value={filters.tag} onChange={(event) => onChange({ ...filters, tag: event.target.value })} className={inputClass}>
            <option value="all">Tag</option>{tags.map((tag) => <option key={tag} value={tag}>#{tag}</option>)}
          </select>
        )}
        {config.visibleFilters.includes('dueState') && (
          <select value={filters.dueState} onChange={(event) => onChange({ ...filters, dueState: event.target.value as TaskFilters['dueState'] })} className={inputClass}>
            <option value="all">Due state</option><option value="upcoming">Upcoming</option><option value="overdue">Overdue</option><option value="no-date">No date</option>
          </select>
        )}
      </div>

      <div className="mt-2 flex justify-end">
        <select value={filters.sortBy} onChange={(event) => onChange({ ...filters, sortBy: event.target.value as TaskFilters['sortBy'] })} className={inputClass}>
          {config.sortOptions.map((sortOption) => (
            <option key={sortOption} value={sortOption}>{getSortLabel(sortOption)}</option>
          ))}
        </select>
      </div>
    </section>
  );
};

export default TaskFiltersBar;
