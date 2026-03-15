interface TopBarProps {
  title: string;
  subtitle: string;
  onNewTask: () => void;
  onOpenSidebar: () => void;
}

const TopBar = ({ title, subtitle, onNewTask, onOpenSidebar }: TopBarProps) => {
  return (
    <header className="flex items-center justify-between border-b border-slate-200/80 bg-white/90 px-4 py-3 backdrop-blur md:px-6">
      <div className="flex items-center gap-2">
        <button onClick={onOpenSidebar} className="rounded-lg px-2 py-1 text-slate-600 md:hidden">
          ☰
        </button>
        <div>
          <h1 className="text-lg font-semibold text-slate-900">{title}</h1>
          <p className="text-xs text-slate-500">{subtitle}</p>
        </div>
      </div>
      <button onClick={onNewTask} className="rounded-full bg-slate-900 px-3.5 py-1.5 text-sm text-white">
        + 新建任务
      </button>
    </header>
  );
};

export default TopBar;
