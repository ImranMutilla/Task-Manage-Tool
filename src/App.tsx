import { useEffect, useMemo, useState } from 'react';
import Sidebar from './components/Sidebar';
import TaskFiltersBar from './components/TaskFilters';
import TaskList from './components/TaskList';
import TaskModal from './components/TaskModal';
import TopBar from './components/TopBar';
import TodayView from './components/TodayView';
import UpcomingView from './components/UpcomingView';
import TaskDetailPanel from './components/TaskDetailPanel';
import { getNextRepeatDue, startOfDay } from './utils/dateTime';
import { loadProjects, loadTasks, saveProjects, saveTasks } from './services/localStorage';
import { ActiveView, Project, Task, TaskInput } from './types/task';
import {
  baseFilters,
  buildTaskFromInput,
  collectTags,
  countsByProject,
  DEFAULT_PROJECTS,
  getToolbarConfig,
  getUpNextTask,
  getViewCounts,
  getVisibleTasks,
  getUpcomingWindowTasks,
  groupUpcomingByDate,
  sanitizeFiltersForView,
  splitTodaySections,
} from './utils/taskUtils';

interface ModalState {
  open: boolean;
  mode: 'create' | 'edit';
  task?: Task;
  presetDate?: string;
}

const App = () => {
  const [tasks, setTasks] = useState<Task[]>(() => loadTasks());
  const [projects, setProjects] = useState<Project[]>(() => loadProjects());
  const [activeView, setActiveView] = useState<ActiveView>({ type: 'today', label: 'Today' });
  const [filters, setFilters] = useState(baseFilters);
  const [modalState, setModalState] = useState<ModalState>({ open: false, mode: 'create' });
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | undefined>();
  const [upcomingWeekOffset, setUpcomingWeekOffset] = useState(0);

  useEffect(() => saveTasks(tasks), [tasks]);
  useEffect(() => saveProjects(projects), [projects]);
  useEffect(() => {
    if (!projects.length) setProjects(DEFAULT_PROJECTS);
  }, [projects]);

  const tags = useMemo(() => collectTags(tasks), [tasks]);
  const toolbarConfig = useMemo(() => getToolbarConfig(activeView), [activeView]);
  const effectiveFilters = useMemo(() => sanitizeFiltersForView(filters, toolbarConfig), [filters, toolbarConfig]);
  const visibleTasks = useMemo(() => getVisibleTasks(tasks, effectiveFilters, activeView), [tasks, effectiveFilters, activeView]);
  const todaySections = useMemo(() => splitTodaySections(tasks), [tasks]);
  const upNext = useMemo(() => getUpNextTask(tasks), [tasks]);
  const countProject = useMemo(() => countsByProject(tasks), [tasks]);
  const baseCounts = useMemo(() => getViewCounts(tasks), [tasks]);

  const counts = useMemo(
    () => ({
      ...baseCounts,
      project: countProject,
    }),
    [baseCounts, countProject],
  );


  const inboxCount = counts.inbox;
  const todayCount = counts.today;
  const upcomingCount = counts.upcoming;
  const projectMap = useMemo(() => new Map(projects.map((project) => [project.id, project])), [projects]);

  useEffect(() => {
    setFilters((prev) => sanitizeFiltersForView(prev, toolbarConfig));
  }, [toolbarConfig]);
  const closeModal = () => setModalState({ open: false, mode: 'create' });

  const onCreate = (input: TaskInput) => {
    setTasks((prev) => [buildTaskFromInput(input, null, projectMap), ...prev]);
    closeModal();
  };

  const onUpdate = (input: TaskInput) => {
    if (!modalState.task) return;
    const next = buildTaskFromInput(input, { id: modalState.task.id, createdAt: modalState.task.createdAt }, projectMap);
    setTasks((prev) => prev.map((task) => (task.id === modalState.task?.id ? next : task)));
    setSelectedTask(next);
    closeModal();
  };

  const toggleDone = (task: Task) => {
    const now = new Date().toISOString();
    const done = task.status === 'done';
    setTasks((prev) => {
      const updated = prev.map((item) =>
        item.id === task.id
          ? { ...item, status: (done ? 'todo' : 'done') as Task['status'], completedAt: done ? undefined : now, updatedAt: now }
          : item,
      );

      if (!done && task.repeat !== 'none' && task.dueDateTime) {
        const repeatDue = getNextRepeatDue(task.dueDateTime, task.repeat);
        updated.unshift({ ...task, id: crypto.randomUUID(), status: 'todo', completedAt: undefined, createdAt: now, updatedAt: now, dueDateTime: repeatDue });
      }
      return updated;
    });
  };

  const deleteTask = (id: string) => setTasks((prev) => prev.filter((task) => task.id !== id));
  const duplicateTask = (task: Task) => {
    const now = new Date().toISOString();
    setTasks((prev) => [{ ...task, id: crypto.randomUUID(), createdAt: now, updatedAt: now, completedAt: undefined, status: 'todo' }, ...prev]);
  };

  const openCreate = (presetDate?: string) => setModalState({ open: true, mode: 'create', presetDate });

  const subtitle =
    activeView.type === 'inbox'
      ? inboxCount > 0
        ? `${inboxCount} task${inboxCount > 1 ? 's' : ''} waiting to be organized`
        : 'Capture first, organize later.'
      : activeView.type === 'today'
        ? todayCount > 0
          ? `${todayCount} task${todayCount > 1 ? 's' : ''} lined up for today`
          : 'Nothing due today. Enjoy the calm.'
        : activeView.type === 'upcoming'
          ? upcomingCount > 0
            ? `${upcomingCount} dated task${upcomingCount > 1 ? 's' : ''} in the next 7 days`
            : 'Plan the next few days clearly.'
          : activeView.type === 'completed'
            ? 'Review your recently finished tasks.'
            : activeView.type === 'tag'
              ? `Tasks tagged with ${activeView.id}`
              : `Project view · ${activeView.label}`;

  const upcomingWindowTasks = useMemo(() => getUpcomingWindowTasks(tasks, effectiveFilters, upcomingWeekOffset), [tasks, effectiveFilters, upcomingWeekOffset]);
  const upcomingGroups = useMemo(() => groupUpcomingByDate(upcomingWindowTasks, upcomingWeekOffset), [upcomingWindowTasks, upcomingWeekOffset]);
  const monthLabel = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(new Date(startOfDay(new Date()).getTime() + upcomingWeekOffset * 7 * 24 * 60 * 60 * 1000));

  const sharedListProps = {
    onToggleDone: toggleDone,
    onEdit: (task: Task) => setModalState({ open: true, mode: 'edit', task }),
    onDelete: deleteTask,
    onDuplicate: duplicateTask,
    onOpenDetail: (task: Task) => setSelectedTask(task),
  };

  const doneToday = tasks.filter((task) => task.status === 'done' && task.completedAt && new Date(task.completedAt).toDateString() === new Date().toDateString()).length;
  const tagStats =
    activeView.type === 'tag'
      ? {
          uncompleted: tasks.filter((task) => task.status !== 'done' && task.tags.includes(activeView.id ?? '')).length,
          today: tasks.filter((task) => task.status !== 'done' && task.tags.includes(activeView.id ?? '') && task.dueDateTime && new Date(task.dueDateTime).toDateString() === new Date().toDateString()).length,
        }
      : null;

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

          <main className="mx-auto w-full max-w-5xl space-y-4 p-4 md:p-6">
            {activeView.type === 'tag' && tagStats && (
              <section className="rounded-xl bg-white/80 p-3 text-sm text-slate-600">
                #{activeView.id} · Tasks tagged with {activeView.id} · Uncompleted {tagStats.uncompleted} · Due today {tagStats.today}
              </section>
            )}

            <TaskFiltersBar filters={effectiveFilters} projects={projects} tags={tags} config={toolbarConfig} onChange={setFilters} />

            {activeView.type === 'today' ? (
              <TodayView {...todaySections} doneToday={doneToday} upNext={upNext} {...sharedListProps} onQuickAddToday={() => openCreate(new Date().toISOString().slice(0, 10))} />
            ) : activeView.type === 'upcoming' ? (
              <UpcomingView
                groups={upcomingGroups}
                monthLabel={monthLabel}
                onPrevWeek={() => setUpcomingWeekOffset((prev) => prev - 1)}
                onNextWeek={() => setUpcomingWeekOffset((prev) => prev + 1)}
                onGoToday={() => setUpcomingWeekOffset(0)}
                onAddByDate={(date) => openCreate(date)}
                {...sharedListProps}
              />
            ) : (
              <>
                <TaskList
                  tasks={visibleTasks}
                  emptyMessage={
                    activeView.type === 'inbox'
                      ? 'No tasks in Inbox. Capture something to get started.'
                      : activeView.type === 'completed'
                        ? 'No completed tasks yet.'
                        : 'No tasks in this view.'
                  }
                  {...sharedListProps}
                />
                {activeView.type === 'inbox' && (
                  <button onClick={() => openCreate()} className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-600">
                    + Add task
                  </button>
                )}
              </>
            )}
          </main>
        </div>
      </div>

      <TaskModal
        open={modalState.open}
        mode={modalState.mode}
        projects={projects}
        initialTask={modalState.task}
        presetDate={modalState.presetDate}
        onSubmit={modalState.mode === 'create' ? onCreate : onUpdate}
        onClose={closeModal}
      />
      <TaskDetailPanel
        task={selectedTask}
        onClose={() => setSelectedTask(undefined)}
        onEdit={(task) => setModalState({ open: true, mode: 'edit', task })}
      />
    </div>
  );
};

export default App;
