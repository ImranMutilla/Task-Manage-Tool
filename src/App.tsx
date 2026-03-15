import { useEffect, useMemo, useState } from 'react';
import FilterBar from './components/FilterBar';
import FocusPanel from './components/FocusPanel';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import { loadTasks, saveTasks } from './services/localStorage';
import { Task, TaskFilters } from './types/task';
import { getFilteredTasks, getFocusTask } from './utils/taskUtils';

const defaultFilters: TaskFilters = {
  search: '',
  status: 'all',
  priority: 'all',
  sortBy: 'dueDate',
};

const App = () => {
  const [tasks, setTasks] = useState<Task[]>(() => loadTasks());
  const [filters, setFilters] = useState<TaskFilters>(defaultFilters);

  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  const visibleTasks = useMemo(() => getFilteredTasks(tasks, filters), [tasks, filters]);
  const focusTask = useMemo(() => getFocusTask(tasks), [tasks]);

  const stats = useMemo(() => {
    const total = tasks.length;
    const done = tasks.filter((task) => task.status === 'done').length;
    const inProgress = tasks.filter((task) => task.status === 'in-progress').length;
    const rate = total ? Math.round((done / total) * 100) : 0;
    return { total, done, inProgress, rate };
  }, [tasks]);

  const addTask = (taskInput: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const task: Task = {
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
      ...taskInput,
    };
    setTasks((prev) => [task, ...prev]);
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

  const editTask = (taskToEdit: Task) => {
    const title = window.prompt('编辑标题', taskToEdit.title);
    if (!title || !title.trim()) return;

    const description = window.prompt('编辑描述', taskToEdit.description ?? '');

    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskToEdit.id
          ? {
              ...task,
              title: title.trim(),
              description: description?.trim() || undefined,
              updatedAt: new Date().toISOString(),
            }
          : task,
      ),
    );
  };

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-8 text-slate-800">
      <div className="mx-auto max-w-6xl space-y-5">
        <header className="rounded-2xl bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900">Smart Task Assistant</h1>
          <p className="mt-1 text-sm text-slate-500">轻量级智能任务管理工具，帮你快速找到现在最该做的事。</p>
          <div className="mt-4 grid grid-cols-2 gap-2 text-sm sm:grid-cols-4">
            <div className="rounded-xl bg-slate-100 p-3">总任务：{stats.total}</div>
            <div className="rounded-xl bg-slate-100 p-3">已完成：{stats.done}</div>
            <div className="rounded-xl bg-slate-100 p-3">进行中：{stats.inProgress}</div>
            <div className="rounded-xl bg-slate-100 p-3">完成率：{stats.rate}%</div>
          </div>
        </header>

        <main className="grid gap-5 lg:grid-cols-[320px,1fr]">
          <TaskForm onAddTask={addTask} />

          <section className="space-y-4">
            <FocusPanel task={focusTask} />
            <FilterBar filters={filters} onChange={setFilters} />
            <TaskList
              tasks={visibleTasks}
              onDelete={deleteTask}
              onStatusChange={updateTaskStatus}
              onEdit={editTask}
            />
          </section>
        </main>
      </div>
    </div>
  );
};

export default App;
