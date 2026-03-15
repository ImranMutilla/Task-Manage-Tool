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
          <option value="all">状态</option>
          <option value="todo">待办</option>
          <option value="in-progress">进行中</option>
          <option value="done">完成</option>
        </select>
        <select
          value={filters.priority}
          onChange={(event) => onChange({ ...filters, priority: event.target.value as TaskFilters['priority'] })}
          className="rounded-lg border border-slate-200 px-2.5 py-2 text-xs"
        >
          <option value="all">优先级</option>
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
          <option value="all">项目</option>
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
          <option value="all">标签</option>
          {tags.map((tag) => (
            <option key={tag} value={tag}>
              #{tag}
            </option>
          ))}
        </select>
        <select
          value={filters.overdue}
          onChange={(event) => onChange({ ...filters, overdue: event.target.value as TaskFilters['overdue'] })}
          className="rounded-lg border border-slate-200 px-2.5 py-2 text-xs"
        >
          <option value="all">是否逾期</option>
          <option value="overdue">仅逾期</option>
        </select>
        <select
          value={filters.sortBy}
          onChange={(event) => onChange({ ...filters, sortBy: event.target.value as TaskFilters['sortBy'] })}
          className="rounded-lg border border-slate-200 px-2.5 py-2 text-xs"
        >
          <option value="dueDateTime">截止时间</option>
          <option value="createdAt">创建时间</option>
          <option value="updatedAt">更新时间</option>
          <option value="priority">优先级</option>
        </select>
      </div>
    </section>
  );
};

export default TaskFiltersBar;
