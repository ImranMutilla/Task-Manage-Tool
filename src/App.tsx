import { useEffect, useMemo, useState } from 'react';
import FilterBar from './components/FilterBar';
import FocusPanel from './components/FocusPanel';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import { loadTasks, saveTasks } from './services/localStorage';
import { Task, TaskFilters, TaskInput } from './types/task';
import { getFilteredTasks, getFocusTask } from './utils/taskUtils';

const defaultFilters: TaskFilters = {
  search: '',
  status: 'all',
  priority: 'all',
  sortBy: 'dueDateTime',
};

type PanelState =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'edit'; task: Task };

const StatCard = ({ label, value }: { label: string; value: string | number }) => (
  <article className="rounded-3xl border border-black/5 bg-white/80 p-4 shadow-[0_20px_50px_-40px_rgba(15,23,42,0.5)] backdrop-blur">
    <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">{label}</p>
    <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">{value}</p>
  </article>
);

const App = () => {
  const [tasks, setTasks] = useState<Task[]>(() => loadTasks());
  const [filters, setFilters] = useState<TaskFilters>(defaultFilters);
  const [panelState, setPanelState] = useState<PanelState>({ mode: 'closed' });
  const [now, setNow] = useState<Date>(new Date());

  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 60 * 1000);
    return () => window.clearInterval(timer);
  }, []);

  const visibleTasks = useMemo(() => getFilteredTasks(tasks, filters), [tasks, filters]);
  const focusTask = useMemo(() => getFocusTask(tasks), [tasks]);

  const stats = useMemo(() => {
    const total = tasks.length;
    const done = tasks.filter((task) => task.status === 'done').length;
    const inProgress = tasks.filter((task) => task.status === 'in-progress').length;
    const todo = tasks.filter((task) => task.status === 'todo').length;
    const rate = total ? Math.round((done / total) * 100) : 0;
    return { total, done, inProgress, todo, rate };
  }, [tasks]);

  const addTask = (taskInput: TaskInput) => {
    const nowTime = new Date().toISOString();
    const task: Task = {
      id: crypto.randomUUID(),
      createdAt: nowTime,
      updatedAt: nowTime,
      ...taskInput,
    };
    setTasks((prev) => [task, ...prev]);
    setPanelState({ mode: 'closed' });
  };

  const updateTask = (id: string, taskInput: TaskInput) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? {
              ...task,
              ...taskInput,
              updatedAt: new Date().toISOString(),
            }
          : task,
      ),
    );
    setPanelState({ mode: 'closed' });
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const updateTaskStatus = (id: string, status: Task['status']) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, status, updatedAt: new Date().toISOString() } : task,
      ),
    );
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7] px-4 py-8 text-slate-800 md:px-8">
      <div className="mx-auto max-w-6xl space-y-5">
        <header className="rounded-3xl border border-black/5 bg-white/80 p-6 shadow-[0_24px_70px_-50px_rgba(15,23,42,0.55)] backdrop-blur">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">Smart Task Assistant</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">Plan with clarity.</h1>
              <p className="mt-2 max-w-xl text-sm text-slate-500">
                一个轻量但完整的智能任务管理产品界面，聚焦优先级、截止时间与执行节奏。
              </p>
            </div>
            <div className="flex items-center gap-3">
              <p className="text-sm text-slate-500">
                {new Intl.DateTimeFormat('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit',
                }).format(now)}
              </p>
              <button
                onClick={() => setPanelState({ mode: 'create' })}
                className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
              >
                + 新建任务
              </button>
            </div>
          </div>
        </header>

        <section className="grid grid-cols-2 gap-3 md:grid-cols-5">
          <StatCard label="Total" value={stats.total} />
          <StatCard label="Done" value={stats.done} />
          <StatCard label="In Progress" value={stats.inProgress} />
          <StatCard label="Todo" value={stats.todo} />
          <StatCard label="Completion" value={`${stats.rate}%`} />
        </section>

        <FocusPanel task={focusTask} />
        <FilterBar filters={filters} onChange={setFilters} />
        <TaskList
          tasks={visibleTasks}
          onDelete={deleteTask}
          onStatusChange={updateTaskStatus}
          onEdit={(task) => setPanelState({ mode: 'edit', task })}
        />
      </div>

      {panelState.mode !== 'closed' && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/20 p-4 backdrop-blur-sm md:items-center">
          <div className="w-full max-w-2xl">
            <TaskForm
              mode={panelState.mode}
              initialValues={panelState.mode === 'edit' ? panelState.task : undefined}
              onSubmitTask={(payload) => {
                if (panelState.mode === 'create') {
                  addTask(payload);
                } else {
                  updateTask(panelState.task.id, payload);
                }
              }}
              onCancel={() => setPanelState({ mode: 'closed' })}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
