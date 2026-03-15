import { ActiveView, Project } from '../types/task';

interface SidebarProps {
  activeView: ActiveView;
  projects: Project[];
  tags: string[];
  counts: {
    inbox: number;
    today: number;
    upcoming: number;
    completed: number;
    project: Record<string, number>;
  };
  onSelectView: (view: ActiveView) => void;
  onNewTask: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

const navBase = [
  { type: 'inbox' as const, label: 'Inbox' },
  { type: 'today' as const, label: 'Today' },
  { type: 'upcoming' as const, label: 'Upcoming' },
  { type: 'completed' as const, label: 'Completed' },
];

const Sidebar = ({
  activeView,
  projects,
  tags,
  counts,
  onSelectView,
  onNewTask,
  mobileOpen,
  onCloseMobile,
}: SidebarProps) => {
  return (
    <>
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 border-r border-slate-200 bg-[#f8f8fa] p-4 transition md:static md:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-slate-900 text-center text-xs font-semibold leading-8 text-white">U</div>
            <div>
              <p className="text-sm font-medium text-slate-800">Your Workspace</p>
              <p className="text-xs text-slate-500">Task clarity mode</p>
            </div>
          </div>
          <button onClick={onCloseMobile} className="rounded-lg px-2 py-1 text-slate-500 md:hidden">
            ✕
          </button>
        </div>

        <button onClick={onNewTask} className="mb-4 w-full rounded-xl bg-slate-900 px-3 py-2 text-sm text-white">
          + Add task
        </button>

        <div className="space-y-1">
          {navBase.map((item) => {
            const isActive = activeView.type === item.type;
            const badgeValue =
              item.type === 'inbox'
                ? counts.inbox
                : item.type === 'today'
                  ? counts.today
                  : item.type === 'upcoming'
                    ? counts.upcoming
                    : counts.completed;

            return (
              <button
                key={item.type}
                onClick={() => onSelectView({ type: item.type, label: item.label })}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm ${
                  isActive ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:bg-white/70'
                }`}
              >
                <span>{item.label}</span>
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">{badgeValue}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-6">
          <p className="mb-2 px-3 text-xs font-medium uppercase tracking-[0.16em] text-slate-400">Projects</p>
          <div className="space-y-1">
            {projects
              .filter((project) => project.id !== 'inbox')
              .map((project) => {
                const isActive = activeView.type === 'project' && activeView.id === project.id;
                return (
                  <button
                    key={project.id}
                    onClick={() => onSelectView({ type: 'project', id: project.id, label: project.name })}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm ${
                      isActive ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:bg-white/70'
                    }`}
                  >
                    <span>{project.name}</span>
                    <span className="text-xs text-slate-400">{counts.project[project.id] ?? 0}</span>
                  </button>
                );
              })}
          </div>
        </div>

        {tags.length > 0 && (
          <div className="mt-6">
            <p className="mb-2 px-3 text-xs font-medium uppercase tracking-[0.16em] text-slate-400">Tags</p>
            <div className="flex flex-wrap gap-1.5 px-2">
              {tags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => onSelectView({ type: 'tag', id: tag, label: `#${tag}` })}
                  className={`rounded-full border px-2.5 py-1 text-xs ${
                    activeView.type === 'tag' && activeView.id === tag
                      ? 'border-slate-300 bg-white text-slate-800'
                      : 'border-slate-200 text-slate-500'
                  }`}
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>
        )}
      </aside>
      {mobileOpen && <div className="fixed inset-0 z-30 bg-black/20 md:hidden" onClick={onCloseMobile} />}
    </>
  );
};

export default Sidebar;
