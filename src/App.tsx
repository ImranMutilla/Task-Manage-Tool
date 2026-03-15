import { useEffect, useMemo, useState } from 'react';
import FocusPanel from './components/FocusPanel';
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
  getFocusTasks,
  getVisibleTasks,
  groupUpcomingByDate,
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
  const visibleTasks = useMemo(() => getVisibleTasks(tasks, filters, activeView), [tasks, filters, activeView]);
  const focusTasks = useMemo(() => getFocusTasks(tasks), [tasks]);
  const todaySections = useMemo(() => splitTodaySections(tasks), [tasks]);
  const countProject = useMemo(() => countsByProject(tasks), [tasks]);

  const counts = useMemo(
    () => ({
      inbox: tasks.filter((task) => task.projectId === 'inbox' && task.status !== 'done').length,
      today: todaySections.overdue.length + todaySections.dueToday.length + todaySections.flexible.length,
      upcoming: tasks.filter((task) => task.status !== 'done' && task.dueDateTime).length,
      completed: tasks.filter((task) => task.status === 'done').length,
      project: countProject,
    }),
    [tasks, todaySections, countProject],
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
    setSelectedTask(next);
    closeModal();
  };

  const toggleDone = (task: Task) => {
    const now = new Date().toISOString();
    const done = task.status === 'done';
    setTasks((prev) => {
      const updated = prev.map((item) => {
        if (item.id !== task.id) return item;
        return {
          ...item,
          status: (done ? 'todo' : 'done') as Task['status'],
          completedAt: done ? undefined : now,
          updatedAt: now,
        };
      });

      if (!done && task.repeat !== 'none' && task.dueDateTime) {
        const repeatDue = getNextRepeatDue(task.dueDateTime, task.repeat);
        updated.unshift({
          ...task,
          id: crypto.randomUUID(),
          status: 'todo',
          completedAt: undefined,
          createdAt: now,
          updatedAt: now,
          dueDateTime: repeatDue,
        });
      }

      return updated;
    });
  };

  const deleteTask = (id: string) => setTasks((prev) => prev.filter((task) => task.id !== id));
  const duplicateTask = (task: Task) => {
    const now = new Date().toISOString();
    setTasks((prev) => [{ ...task, id: crypto.randomUUID(), createdAt: now, updatedAt: now, completedAt: undefined, status: 'todo' }, ...prev]);
  };

  const openCreate = (presetDate?: string, today = false) => {
    setModalState({ open: true, mode: 'create', presetDate });
    if (today) {
      setTimeout(() => {
        // noop for UX pacing
      }, 0);
    }
  };

  const subtitle =
    activeView.type === 'inbox'
      ? 'Capture tasks quickly and organize later.'
      : activeView.type === 'today'
        ? 'Plan execution by overdue, due today, and flexible tasks.'
        : activeView.type === 'upcoming'
          ? 'Preview and schedule the next days clearly.'
          : activeView.type === 'completed'
            ? 'Review completed tasks and recurring outcomes.'
            : `Filtered view · ${activeView.label}`;

  const upcomingGroups = useMemo(() => groupUpcomingByDate(visibleTasks, upcomingWeekOffset), [visibleTasks, upcomingWeekOffset]);
  const monthLabel = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(
    new Date(startOfDay(new Date()).getTime() + upcomingWeekOffset * 7 * 24 * 60 * 60 * 1000),
  );

  const sharedListProps = {
    onToggleDone: toggleDone,
    onEdit: (task: Task) => setModalState({ open: true, mode: 'edit', task }),
    onDelete: deleteTask,
    onDuplicate: duplicateTask,
    onOpenDetail: (task: Task) => setSelectedTask(task),
  };

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

            {activeView.type === 'today' ? (
              <TodayView {...todaySections} {...sharedListProps} onQuickAddToday={() => openCreate(new Date().toISOString().slice(0, 10), true)} />
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
                <TaskList tasks={visibleTasks} emptyMessage={activeView.type === 'inbox' ? 'No tasks in Inbox. Capture something to get started.' : activeView.type === 'completed' ? 'No completed tasks yet.' : 'No tasks in this view.'} {...sharedListProps} />
                {activeView.type === 'inbox' && (
                  <button onClick={() => openCreate()} className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-600">+ Add task</button>
                )}
              </>
            )}
          </main>
        </div>
      </div>

      <TaskModal open={modalState.open} mode={modalState.mode} projects={projects} initialTask={modalState.task} presetDate={modalState.presetDate} onSubmit={modalState.mode === 'create' ? onCreate : onUpdate} onClose={closeModal} />
      <TaskDetailPanel task={selectedTask} onClose={() => setSelectedTask(undefined)} onEdit={(task) => setModalState({ open: true, mode: 'edit', task })} />
    </div>
  );
};

export default App;
