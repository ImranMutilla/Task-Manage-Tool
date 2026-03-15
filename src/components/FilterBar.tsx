import { TaskFilters } from '../types/task';

interface FilterBarProps {
  filters: TaskFilters;
  onChange: (filters: TaskFilters) => void;
}

const FilterBar = ({ filters, onChange }: FilterBarProps) => {
  return (
    <section className="rounded-2xl bg-white p-4 shadow-sm">
      <div className="grid grid-cols-1 gap-2 md:grid-cols-4">
        <input
          value={filters.search}
          onChange={(event) => onChange({ ...filters, search: event.target.value })}
          placeholder="搜索任务标题..."
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none ring-indigo-100 focus:ring"
        />

        <select
          value={filters.status}
          onChange={(event) => onChange({ ...filters, status: event.target.value as TaskFilters['status'] })}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none ring-indigo-100 focus:ring"
        >
          <option value="all">全部状态</option>
          <option value="todo">待办</option>
          <option value="in-progress">进行中</option>
          <option value="done">已完成</option>
        </select>

        <select
          value={filters.priority}
          onChange={(event) => onChange({ ...filters, priority: event.target.value as TaskFilters['priority'] })}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none ring-indigo-100 focus:ring"
        >
          <option value="all">全部优先级</option>
          <option value="high">高</option>
          <option value="medium">中</option>
          <option value="low">低</option>
        </select>

        <select
          value={filters.sortBy}
          onChange={(event) => onChange({ ...filters, sortBy: event.target.value as TaskFilters['sortBy'] })}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none ring-indigo-100 focus:ring"
        >
          <option value="dueDate">按截止日期排序</option>
          <option value="createdAt">按创建时间排序</option>
        </select>
      </div>
    </section>
  );
};

export default FilterBar;
