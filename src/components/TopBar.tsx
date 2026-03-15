interface TopBarProps {
  title: string;
  subtitle: string;
  onOpenSidebar: () => void;
}

const TopBar = ({ title, subtitle, onOpenSidebar }: TopBarProps) => {
  return (
    <header className="flex items-center justify-between border-b border-slate-200/70 bg-white/75 px-4 py-3 backdrop-blur md:px-6">
      <div className="flex items-center gap-2">
        <button onClick={onOpenSidebar} className="rounded-lg px-2 py-1 text-slate-600 md:hidden">
          ☰
        </button>
        <div>
          <h1 className="text-lg font-semibold tracking-tight text-slate-900">{title}</h1>
          <p className="text-xs text-slate-500">{subtitle}</p>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
