interface ViewModeSwitchProps {
  mode: 'list' | 'board';
  onChange: (mode: 'list' | 'board') => void;
}

const ViewModeSwitch = ({ mode, onChange }: ViewModeSwitchProps) => {
  return (
    <div className="inline-flex rounded-lg border border-slate-200 bg-white p-0.5 text-xs">
      <button
        onClick={() => onChange('list')}
        className={`rounded-md px-2.5 py-1 ${mode === 'list' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-50'}`}
      >
        List
      </button>
      <button
        onClick={() => onChange('board')}
        className={`rounded-md px-2.5 py-1 ${mode === 'board' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-50'}`}
      >
        Board
      </button>
    </div>
  );
};

export default ViewModeSwitch;
