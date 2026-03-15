import { useEffect, useMemo, useState } from 'react';
import FocusPanel from './components/FocusPanel';
import Sidebar from './components/Sidebar';
import TaskFiltersBar from './components/TaskFilters';
import TaskList from './components/TaskList';
import TaskModal from './components/TaskModal';
import TopBar from './components/TopBar';
import { loadProjects, loadTasks, saveProjects, saveTasks } from './services/localStorage';
import { ActiveView, Project, Task, TaskInput } from './types/task';
import {
  baseFilters,
  buildTaskFromInput,
  collectTags,
  countsByProject,
  DEFAULT_PROJECTS,
  getFocusTasks,
  getVisibleTasks,
  splitUpcomingGroups,
} from './utils/taskUtils';

interface ModalState {
  open: boolean;
  mode: 'create' | 'edit';
  task?: Task;
}

const App = () => {
  const [tasks, setTasks] = useState<Task[]>(() => loadTasks());
  const [projects, setProjects] = useState<Project[]>(() => loadProjects());
  const [activeView, setActiveView] = useState<ActiveView>({ type: 'today', label: 'Today' });
  const [filters, setFilters] = useState(baseFilters);
  const [modalState, setModalState] = useState<ModalState>({ open: false, mode: 'create' });
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => saveTasks(tasks), [tasks]);
  useEffect(() => saveProjects(projects), [projects]);
  useEffect(() => {
    if (!projects.length) setProjects(DEFAULT_PROJECTS);
  }, [projects]);

  const tags = useMemo(() => collectTags(tasks), [tasks]);
  const visibleTasks = useMemo(() => getVisibleTasks(tasks, filters, activeView), [tasks, filters, activeView]);
  const focusTasks = useMemo(() => getFocusTasks(tasks), [tasks]);
  const countProject = useMemo(() => countsByProject(tasks), [tasks]);

  const counts = useMemo(
    () => ({
      inbox: tasks.filter((task) => task.projectId === 'inbox' && task.status !== 'done').length,
      today: tasks.filter((task) => task.status !== 'done' && task.isInToday).length,
      upcoming: tasks.filter((task) => task.status !== 'done' && task.dueDateTime).length,
      completed: tasks.filter((task) => task.status === 'done').length,
      project: countProject,
    }),
    [tasks, countProject],
  );

  const projectMap = useMemo(() => new Map(projects.map((project) => [project.id, project])), [projects]);
  const closeModal = () => setModalState({ open: false, mode: 'create' });

  const onCreate = (input: TaskInput) => {
    setTasks((prev) => [buildTaskFromInput(input, null, projectMap), ...prev]);
    closeModal();
  };

  const onUpdate = (input: TaskInput) => {
    if (!modalState.task) return;
    const next = buildTaskFromInput(input, { id: modalState.task.id, createdAt: modalState.task.createdAt }, projectMap);
    setTasks((prev) => prev.map((task) => (task.id === modalState.task?.id ? next : task)));
    closeModal();
  };

  const toggleDone = (task: Task) => {
    const now = new Date().toISOString();
    const done = task.status === 'done';
    setTasks((prev) =>
      prev.map((item) =>
        item.id === task.id
          ? { ...item, status: done ? 'todo' : 'done', completedAt: done ? undefined : now, updatedAt: now }
          : item,
      ),
    );
  };

  const deleteTask = (id: string) => setTasks((prev) => prev.filter((task) => task.id !== id));
  const duplicateTask = (task: Task) => {
    const now = new Date().toISOString();
    setTasks((prev) => [{ ...task, id: crypto.randomUUID(), createdAt: now, updatedAt: now, completedAt: undefined, status: 'todo' }, ...prev]);
  };

  const subtitle =
    activeView.type === 'inbox'
      ? 'No tasks in Inbox. Capture something to get started.'
      : activeView.type === 'today'
        ? 'Nothing due today? Enjoy the calm.'
        : activeView.type === 'upcoming'
          ? 'Plan what is next by date and time.'
          : activeView.type === 'completed'
            ? 'Review completed tasks and restore if needed.'
            : `Filtered view · ${activeView.label}`;

  const upcomingGroups = activeView.type === 'upcoming' ? splitUpcomingGroups(visibleTasks) : [];

  return (
    <div className="min-h-screen bg-[#f5f5f7] text-slate-800">
      <div className="flex min-h-screen">
        <Sidebar
          activeView={activeView}
          projects={projects}
          tags={tags}
          counts={counts}
          onSelectView={(view) => {
            setActiveView(view);
            setMobileSidebarOpen(false);
          }}
          onNewTask={() => setModalState({ open: true, mode: 'create' })}
          mobileOpen={mobileSidebarOpen}
          onCloseMobile={() => setMobileSidebarOpen(false)}
        />

        <div className="flex min-w-0 flex-1 flex-col">
          <TopBar title={activeView.label} subtitle={subtitle} onNewTask={() => setModalState({ open: true, mode: 'create' })} onOpenSidebar={() => setMobileSidebarOpen(true)} />

          <main className="mx-auto w-full max-w-5xl space-y-3 p-4 md:p-6">
            {(activeView.type === 'today' || activeView.type === 'inbox') && <FocusPanel tasks={focusTasks} />}
            <TaskFiltersBar filters={filters} projects={projects} tags={tags} onChange={setFilters} />

            {activeView.type === 'upcoming' ? (
              <div className="space-y-4">
                {upcomingGroups.length === 0 && (
                  <section className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center text-sm text-slate-500">
                    No upcoming tasks. Add one from the task composer.
                  </section>
                )}
                {upcomingGroups.map((group) => (
                  <div key={group.label}>
                    <h3 className="mb-2 px-1 text-sm font-medium text-slate-600">{group.label}</h3>
                    <TaskList tasks={group.items} emptyMessage="" onToggleDone={toggleDone} onEdit={(task) => setModalState({ open: true, mode: 'edit', task })} onDelete={deleteTask} onDuplicate={duplicateTask} />
                  </div>
                ))}
              </div>
            ) : (
              <TaskList tasks={visibleTasks} emptyMessage="No tasks in this view. Add a task to get started." onToggleDone={toggleDone} onEdit={(task) => setModalState({ open: true, mode: 'edit', task })} onDelete={deleteTask} onDuplicate={duplicateTask} />
            )}
          </main>
        </div>
      </div>

      <TaskModal open={modalState.open} mode={modalState.mode} projects={projects} initialTask={modalState.task} onSubmit={modalState.mode === 'create' ? onCreate : onUpdate} onClose={closeModal} />
    </div>
  );
};

export default App;
