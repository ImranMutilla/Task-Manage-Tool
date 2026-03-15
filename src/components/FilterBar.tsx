import { TaskFilters } from '../types/task';

interface FilterBarProps {
  filters: TaskFilters;
  onChange: (filters: TaskFilters) => void;
}

const FilterBar = ({ filters, onChange }: FilterBarProps) => {
  return (
    <section className="rounded-3xl border border-black/5 bg-white/80 p-4 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.4)] backdrop-blur">
      <div className="grid grid-cols-1 gap-2.5 md:grid-cols-4">
        <input
          value={filters.search}
          onChange={(event) => onChange({ ...filters, search: event.target.value })}
          placeholder="Search title or tags..."
          className="rounded-2xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-slate-300 focus:ring-2 focus:ring-slate-200"
        />

        <select
          value={filters.status}
          onChange={(event) => onChange({ ...filters, status: event.target.value as TaskFilters['status'] })}
          className="rounded-2xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-slate-300 focus:ring-2 focus:ring-slate-200"
        >
          <option value="all">全部状态</option>
          <option value="todo">待办</option>
          <option value="in-progress">进行中</option>
          <option value="done">已完成</option>
        </select>

        <select
          value={filters.priority}
          onChange={(event) => onChange({ ...filters, priority: event.target.value as TaskFilters['priority'] })}
          className="rounded-2xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-slate-300 focus:ring-2 focus:ring-slate-200"
        >
          <option value="all">全部优先级</option>
          <option value="high">高</option>
          <option value="medium">中</option>
          <option value="low">低</option>
        </select>

        <select
          value={filters.sortBy}
          onChange={(event) => onChange({ ...filters, sortBy: event.target.value as TaskFilters['sortBy'] })}
          className="rounded-2xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-slate-300 focus:ring-2 focus:ring-slate-200"
        >
          <option value="dueDateTime">按截止时间排序</option>
          <option value="createdAt">按创建时间排序</option>
        </select>
      </div>
    </section>
  );
};

export default FilterBar;
