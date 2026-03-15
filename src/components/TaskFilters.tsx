import { Project, TaskFilters } from '../types/task';

interface TaskFiltersProps {
  filters: TaskFilters;
  projects: Project[];
  tags: string[];
  onChange: (next: TaskFilters) => void;
}

const TaskFiltersBar = ({ filters, projects, tags, onChange }: TaskFiltersProps) => {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white px-3 py-2.5">
      <div className="grid grid-cols-1 gap-2 md:grid-cols-7">
        <input
          value={filters.search}
          onChange={(event) => onChange({ ...filters, search: event.target.value })}
          placeholder="Search title/desc/tag/project"
          className="rounded-lg border border-slate-200 px-2.5 py-2 text-xs"
        />
        <select
          value={filters.status}
          onChange={(event) => onChange({ ...filters, status: event.target.value as TaskFilters['status'] })}
          className="rounded-lg border border-slate-200 px-2.5 py-2 text-xs"
        >
          <option value="all">Status</option>
          <option value="todo">待办</option>
          <option value="in-progress">进行中</option>
          <option value="done">完成</option>
        </select>
        <select
          value={filters.priority}
          onChange={(event) => onChange({ ...filters, priority: event.target.value as TaskFilters['priority'] })}
          className="rounded-lg border border-slate-200 px-2.5 py-2 text-xs"
        >
          <option value="all">Priority</option>
          <option value="p1">P1</option>
          <option value="p2">P2</option>
          <option value="p3">P3</option>
          <option value="p4">P4</option>
        </select>
        <select
          value={filters.projectId}
          onChange={(event) => onChange({ ...filters, projectId: event.target.value })}
          className="rounded-lg border border-slate-200 px-2.5 py-2 text-xs"
        >
          <option value="all">Project</option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>
        <select
          value={filters.tag}
          onChange={(event) => onChange({ ...filters, tag: event.target.value })}
          className="rounded-lg border border-slate-200 px-2.5 py-2 text-xs"
        >
          <option value="all">Tag</option>
          {tags.map((tag) => (
            <option key={tag} value={tag}>
              #{tag}
            </option>
          ))}
        </select>
        <select
          value={filters.dueState}
          onChange={(event) => onChange({ ...filters, dueState: event.target.value as TaskFilters['dueState'] })}
          className="rounded-lg border border-slate-200 px-2.5 py-2 text-xs"
        >
          <option value="all">All</option>
          <option value="upcoming">Upcoming</option>
          <option value="overdue">Overdue</option>
          <option value="no-date">No date</option>
        </select>
        <select
          value={filters.sortBy}
          onChange={(event) => onChange({ ...filters, sortBy: event.target.value as TaskFilters['sortBy'] })}
          className="rounded-lg border border-slate-200 px-2.5 py-2 text-xs"
        >
          <option value="dueDateTime">Due date</option>
          <option value="createdAt">Created time</option>
          <option value="updatedAt">Updated time</option>
          <option value="priority">Priority</option>
        </select>
      </div>
    </section>
  );
};

export default TaskFiltersBar;
