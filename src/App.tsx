import { useEffect, useMemo, useState } from 'react';
import Sidebar from './components/Sidebar';
import TaskFiltersBar from './components/TaskFilters';
import TaskList from './components/TaskList';
import TaskBoard, { TaskBoardColumn } from './components/TaskBoard';
import TaskModal from './components/TaskModal';
import TopBar from './components/TopBar';
import ViewModeSwitch from './components/ViewModeSwitch';
import TodayView from './components/TodayView';
import UpcomingView from './components/UpcomingView';
import TaskDetailPanel from './components/TaskDetailPanel';
import { getNextRepeatDue, startOfDay } from './utils/dateTime';
import { loadProjects, loadTags, loadTasks, saveProjects, saveTags, saveTasks } from './services/localStorage';
import { ActiveView, Project, TagOption, Task, TaskInput } from './types/task';
import {
  baseFilters,
  buildTaskFromInput,
  countsByProject,
  DEFAULT_PROJECTS,
  DEFAULT_TAGS,
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
  presetProjectId?: string;
  presetTodayPinned?: boolean;
}

const getCompletedGroupLabel = (value?: string): string => {
  if (!value) return 'Earlier';
  const date = new Date(value);
  const today = new Date();
  const startToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const startYesterday = new Date(startToday);
  startYesterday.setDate(startYesterday.getDate() - 1);
  const startWeek = new Date(startToday);
  startWeek.setDate(startWeek.getDate() - 7);

  if (date >= startToday) return 'Today';
  if (date >= startYesterday) return 'Yesterday';
  if (date >= startWeek) return 'Earlier this week';
  return 'Earlier';
};

const slugify = (value: string): string =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

type ViewMode = 'list' | 'board';

const VIEW_MODE_KEY = 'smart_task_assistant_view_modes';

const loadViewModes = (): Record<string, ViewMode> => {
  try {
    const raw = localStorage.getItem(VIEW_MODE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, ViewMode>;
    return parsed ?? {};
  } catch {
    return {};
  }
};

const App = () => {
  const [tasks, setTasks] = useState<Task[]>(() => loadTasks());
  const [projects, setProjects] = useState<Project[]>(() => loadProjects());
  const [tagOptions, setTagOptions] = useState<TagOption[]>(() => loadTags());
  const [activeView, setActiveView] = useState<ActiveView>({ type: 'today', label: 'Today' });
  const [filters, setFilters] = useState(baseFilters);
  const [modalState, setModalState] = useState<ModalState>({ open: false, mode: 'create' });
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | undefined>();
  const [upcomingWeekOffset, setUpcomingWeekOffset] = useState(0);
  const [viewModes, setViewModes] = useState<Record<string, ViewMode>>(() => loadViewModes());

  useEffect(() => saveTasks(tasks), [tasks]);
  useEffect(() => saveProjects(projects), [projects]);
  useEffect(() => saveTags(tagOptions), [tagOptions]);
  useEffect(() => localStorage.setItem(VIEW_MODE_KEY, JSON.stringify(viewModes)), [viewModes]);
  useEffect(() => {
    if (!projects.length) setProjects(DEFAULT_PROJECTS);
  }, [projects]);

  const allTagOptions = useMemo(() => {
    const map = new Map<string, TagOption>();
    for (const tag of tagOptions) map.set(tag.name.toLowerCase(), tag);
    for (const taskTag of tasks.flatMap((task) => task.tags)) {
      const key = taskTag.toLowerCase();
      if (!map.has(key)) {
        map.set(key, {
          id: slugify(taskTag) || crypto.randomUUID(),
          name: taskTag,
          colorClass: 'bg-slate-100 text-slate-600',
        });
      }
    }
    return [...map.values()];
  }, [tagOptions, tasks]);

  const tags = useMemo(() => allTagOptions.map((tag) => tag.name), [allTagOptions]);
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


  const viewModeKey = activeView.type === 'project' ? 'project' : activeView.type === 'tag' ? 'tag' : activeView.type;
  const currentViewMode = viewModes[viewModeKey] ?? (activeView.type === 'upcoming' ? 'board' : 'list');
  const setCurrentViewMode = (mode: ViewMode) => setViewModes((prev) => ({ ...prev, [viewModeKey]: mode }));

  useEffect(() => {
    setFilters((prev) => sanitizeFiltersForView(prev, toolbarConfig));
  }, [toolbarConfig]);

  const closeModal = () => setModalState({ open: false, mode: 'create' });

  useEffect(() => {
    const onShortcut = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const isTyping = target?.tagName === 'INPUT' || target?.tagName === 'TEXTAREA' || target?.isContentEditable;
      if (isTyping) return;

      if (event.key.toLowerCase() === 'q' || event.key.toLowerCase() === 'n') {
        event.preventDefault();
        openCreate();
      }

      if (event.key === '/' || event.key.toLowerCase() === 'f') {
        event.preventDefault();
        const searchInput = document.getElementById('task-search-input') as HTMLInputElement | null;
        searchInput?.focus();
      }
    };

    window.addEventListener('keydown', onShortcut);
    return () => window.removeEventListener('keydown', onShortcut);
  }, [activeView]);

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

  const applyTaskStatus = (task: Task, status: Task['status']) => {
    const now = new Date().toISOString();
    setTasks((prev) => {
      const updated = prev.map((item) =>
        item.id === task.id
          ? {
              ...item,
              status,
              completedAt: status === 'done' ? now : undefined,
              updatedAt: now,
            }
          : item,
      );

      if (status === 'done' && task.status !== 'done' && task.repeat !== 'none' && task.dueDateTime) {
        const repeatDue = getNextRepeatDue(task.dueDateTime, task.repeat);
        updated.unshift({ ...task, id: crypto.randomUUID(), status: 'todo', completedAt: undefined, createdAt: now, updatedAt: now, dueDateTime: repeatDue });
      }

      return updated;
    });
  };

  const toggleDone = (task: Task) => {
    applyTaskStatus(task, task.status === 'done' ? 'todo' : 'done');
  };

  const setTaskStatus = (task: Task, status: Task['status']) => {
    applyTaskStatus(task, status);
  };

  const deleteTask = (id: string) => setTasks((prev) => prev.filter((task) => task.id !== id));
  const duplicateTask = (task: Task) => {
    const now = new Date().toISOString();
    setTasks((prev) => [{ ...task, id: crypto.randomUUID(), createdAt: now, updatedAt: now, completedAt: undefined, status: 'todo' }, ...prev]);
  };

  const openCreate = (options?: { presetDate?: string; presetProjectId?: string; presetTodayPinned?: boolean }) => {
    setModalState({
      open: true,
      mode: 'create',
      presetDate: options?.presetDate,
      presetProjectId: options?.presetProjectId,
      presetTodayPinned: options?.presetTodayPinned,
    });
  };

  const createProject = () => {
    const name = window.prompt('Project name');
    if (!name?.trim()) return;
    const idBase = slugify(name);
    const hasTaken = projects.some((project) => project.id === idBase || project.name.toLowerCase() === name.trim().toLowerCase());
    const id = hasTaken ? `${idBase}-${Date.now()}` : idBase;
    setProjects((prev) => [...prev, { id, name: name.trim() }]);
  };

  const editProject = (project: Project) => {
    const nextName = window.prompt('Rename project', project.name);
    if (!nextName?.trim() || nextName.trim() === project.name) return;
    const renamed = nextName.trim();
    setProjects((prev) => prev.map((item) => (item.id === project.id ? { ...item, name: renamed } : item)));
    setTasks((prev) => prev.map((task) => (task.projectId === project.id ? { ...task, projectName: renamed, updatedAt: new Date().toISOString() } : task)));
    if (activeView.type === 'project' && activeView.id === project.id) {
      setActiveView({ ...activeView, label: renamed });
    }
  };

  const deleteProject = (project: Project) => {
    if (project.id === 'inbox') return;
    const ok = window.confirm(`Delete project "${project.name}"? Tasks will be moved to Inbox.`);
    if (!ok) return;
    setProjects((prev) => prev.filter((item) => item.id !== project.id));
    setTasks((prev) =>
      prev.map((task) =>
        task.projectId === project.id
          ? { ...task, projectId: 'inbox', projectName: 'Inbox', updatedAt: new Date().toISOString() }
          : task,
      ),
    );
    if (activeView.type === 'project' && activeView.id === project.id) {
      setActiveView({ type: 'inbox', label: 'Inbox' });
    }
  };

  const createTag = () => {
    const name = window.prompt('Tag name');
    if (!name?.trim()) return;
    if (allTagOptions.some((tag) => tag.name.toLowerCase() === name.trim().toLowerCase())) return;
    const palette = DEFAULT_TAGS.map((tag) => tag.colorClass);
    const colorClass = palette[tagOptions.length % palette.length] ?? 'bg-slate-100 text-slate-600';
    const newTag: TagOption = {
      id: slugify(name) || crypto.randomUUID(),
      name: name.trim(),
      colorClass,
    };
    setTagOptions((prev) => [...prev, newTag]);
  };

  const editTag = (tag: TagOption) => {
    const nextName = window.prompt('Rename tag', tag.name);
    if (!nextName?.trim() || nextName.trim() === tag.name) return;
    const renamed = nextName.trim();
    setTagOptions((prev) => prev.map((item) => (item.id === tag.id ? { ...item, name: renamed } : item)));
    setTasks((prev) =>
      prev.map((task) => ({
        ...task,
        tags: task.tags.map((item) => (item === tag.name ? renamed : item)),
        updatedAt: task.tags.includes(tag.name) ? new Date().toISOString() : task.updatedAt,
      })),
    );
    if (activeView.type === 'tag' && activeView.id === tag.name) {
      setActiveView({ type: 'tag', id: renamed, label: `#${renamed}` });
    }
  };

  const deleteTag = (tag: TagOption) => {
    const ok = window.confirm(`Delete tag "${tag.name}"? It will be removed from related tasks.`);
    if (!ok) return;
    setTagOptions((prev) => prev.filter((item) => item.id !== tag.id));
    setTasks((prev) =>
      prev.map((task) =>
        task.tags.includes(tag.name)
          ? { ...task, tags: task.tags.filter((item) => item !== tag.name), updatedAt: new Date().toISOString() }
          : task,
      ),
    );
    if (activeView.type === 'tag' && activeView.id === tag.name) {
      setActiveView({ type: 'today', label: 'Today' });
    }
  };

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
    onSetStatus: setTaskStatus,
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

  const completedGroups = useMemo(() => {
    if (activeView.type !== 'completed') return [];
    const groups = new Map<string, Task[]>();
    for (const task of visibleTasks) {
      const label = getCompletedGroupLabel(task.completedAt);
      if (!groups.has(label)) groups.set(label, []);
      groups.get(label)?.push(task);
    }
    return [...groups.entries()];
  }, [activeView.type, visibleTasks]);


  const boardColumns = useMemo<TaskBoardColumn[]>(() => {
    if (activeView.type === 'inbox' || activeView.type === 'project' || activeView.type === 'tag') {
      const source = visibleTasks;
      return [
        { id: 'todo', title: 'Todo', tasks: source.filter((task) => task.status === 'todo'), emptyMessage: 'No tasks' },
        { id: 'in-progress', title: 'In progress', tasks: source.filter((task) => task.status === 'in-progress'), emptyMessage: 'No tasks' },
        { id: 'done', title: 'Done', tasks: source.filter((task) => task.status === 'done'), emptyMessage: 'No tasks' },
      ];
    }

    if (activeView.type === 'today') {
      return [
        { id: 'overdue', title: 'Overdue', tasks: todaySections.overdue, emptyMessage: 'No overdue tasks' },
        { id: 'due', title: 'Due Today', tasks: todaySections.dueToday, emptyMessage: 'Nothing scheduled' },
        { id: 'flex', title: 'Flexible', tasks: todaySections.flexible, emptyMessage: 'No flexible tasks' },
      ];
    }

    if (activeView.type === 'upcoming') {
      return upcomingGroups.map((group) => ({
        id: group.date,
        title: group.label,
        subtitle: `${group.items.length} task${group.items.length === 1 ? '' : 's'}`,
        tasks: group.items,
        emptyMessage: 'Nothing planned',
        addLabel: '+ Add task',
        onAdd: () => openCreate({ presetDate: group.date }),
      }));
    }

    if (activeView.type === 'completed') {
      const mapping: Record<string, Task[]> = {
        Today: [],
        Yesterday: [],
        'Earlier this week': [],
      };
      for (const task of visibleTasks) {
        const key = getCompletedGroupLabel(task.completedAt);
        if (key in mapping) mapping[key].push(task);
      }
      return [
        { id: 'today', title: 'Today', tasks: mapping.Today, emptyMessage: 'No completed tasks' },
        { id: 'yesterday', title: 'Yesterday', tasks: mapping.Yesterday, emptyMessage: 'No completed tasks' },
        { id: 'earlier', title: 'Earlier this week', tasks: mapping['Earlier this week'], emptyMessage: 'No completed tasks' },
      ];
    }

    return [];
  }, [activeView.type, visibleTasks, todaySections, upcomingGroups]);

  const projectEmptyState =
    activeView.type === 'project' && visibleTasks.length === 0
      ? {
          title: `No tasks in ${activeView.label}`,
          hint: `Add your first ${activeView.label.toLowerCase()} task to start organizing this project.`,
          button: `+ Add task to ${activeView.label}`,
        }
      : null;

  return (
    <div className="min-h-screen bg-[#f5f5f7] text-slate-800">
      <div className="flex min-h-screen">
        <Sidebar
          activeView={activeView}
          projects={projects}
          tags={allTagOptions}
          counts={counts}
          onSelectView={(view) => {
            setActiveView(view);
            setMobileSidebarOpen(false);
          }}
          onNewTask={() => openCreate()}
          onCreateProject={createProject}
          onEditProject={editProject}
          onDeleteProject={deleteProject}
          onCreateTag={createTag}
          onEditTag={editTag}
          onDeleteTag={deleteTag}
          mobileOpen={mobileSidebarOpen}
          onCloseMobile={() => setMobileSidebarOpen(false)}
        />

        <div className="flex min-w-0 flex-1 flex-col">
          <TopBar title={activeView.label} subtitle={subtitle} onOpenSidebar={() => setMobileSidebarOpen(true)} />

          <main className="mx-auto w-full max-w-5xl space-y-4 p-4 md:p-6">
            {activeView.type === 'tag' && tagStats && (
              <section className="rounded-xl bg-white/80 p-3 text-sm text-slate-600">
                #{activeView.id} · Tasks tagged with {activeView.id} · Uncompleted {tagStats.uncompleted} · Due today {tagStats.today}
              </section>
            )}

            <div className="flex items-center justify-between gap-2">
              <TaskFiltersBar filters={effectiveFilters} projects={projects} tags={tags} config={toolbarConfig} onChange={setFilters} />
              <ViewModeSwitch mode={currentViewMode} onChange={setCurrentViewMode} />
            </div>

            {currentViewMode === 'board' ? (
              <TaskBoard columns={boardColumns} mode={activeView.type === 'upcoming' ? 'horizontal' : 'grid'} enableStatusMenu={activeView.type === 'today' || activeView.type === 'upcoming'} {...sharedListProps} />
            ) : activeView.type === 'today' ? (
              <TodayView
                {...todaySections}
                doneToday={doneToday}
                upNext={upNext}
                {...sharedListProps}
                onQuickAddToday={() => openCreate({ presetDate: new Date().toISOString().slice(0, 10), presetTodayPinned: true })}
              />
            ) : activeView.type === 'upcoming' ? (
              <UpcomingView
                groups={upcomingGroups}
                monthLabel={monthLabel}
                onPrevWeek={() => setUpcomingWeekOffset((prev) => prev - 1)}
                onNextWeek={() => setUpcomingWeekOffset((prev) => prev + 1)}
                onGoToday={() => setUpcomingWeekOffset(0)}
                onAddByDate={(date) => openCreate({ presetDate: date })}
                enableStatusMenu
                {...sharedListProps}
              />
            ) : (
              <>
                {projectEmptyState ? (
                  <section className="rounded-xl border border-slate-200/70 bg-white/80 p-4">
                    <h3 className="text-sm font-semibold text-slate-800">{projectEmptyState.title}</h3>
                    <p className="mt-1 text-sm text-slate-500">{projectEmptyState.hint}</p>
                    <button
                      onClick={() => openCreate({ presetProjectId: activeView.id })}
                      className="mt-3 rounded-md px-1 py-1 text-sm text-slate-500 hover:text-slate-800"
                    >
                      {projectEmptyState.button}
                    </button>
                  </section>
                ) : activeView.type === 'completed' ? (
                  completedGroups.length ? (
                    <div className="space-y-3">
                      {completedGroups.map(([label, groupTasks]) => (
                        <section key={label} className="space-y-1">
                          <h3 className="px-1 text-sm font-medium text-slate-600">{label}</h3>
                          <TaskList tasks={groupTasks} emptyMessage="No completed tasks yet." {...sharedListProps} />
                        </section>
                      ))}
                    </div>
                  ) : (
                    <TaskList tasks={[]} emptyMessage="No completed tasks yet." {...sharedListProps} />
                  )
                ) : (
                  <>
                    {activeView.type === 'project' && (
                      <section className="rounded-xl bg-white/70 px-3 py-2 text-xs text-slate-500">
                        {visibleTasks.length} open task{visibleTasks.length === 1 ? '' : 's'} in {activeView.label}
                      </section>
                    )}
                    <TaskList
                      tasks={visibleTasks}
                      emptyMessage={activeView.type === 'inbox' ? 'No tasks in Inbox. Capture something to get started.' : 'No tasks in this view.'}
                      showOrganizeActions={activeView.type === 'inbox'}
                      {...sharedListProps}
                    />
                  </>
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
        presetProjectId={modalState.presetProjectId}
        presetTodayPinned={modalState.presetTodayPinned}
        tagOptions={allTagOptions}
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
