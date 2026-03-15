import { TagOption } from '../types/task';

interface TagPickerProps {
  selected: string[];
  options: TagOption[];
  onChange: (tags: string[]) => void;
}

const TagPicker = ({ selected, options, onChange }: TagPickerProps) => {
  const toggle = (name: string) => {
    if (selected.includes(name)) {
      onChange(selected.filter((tag) => tag !== name));
      return;
    }
    onChange([...selected, name]);
  };

  return (
    <div className="flex flex-wrap gap-1.5 rounded-lg border border-slate-200 bg-white p-2">
      {options.map((tag) => {
        const active = selected.includes(tag.name);
        return (
          <button
            key={tag.id}
            type="button"
            onClick={() => toggle(tag.name)}
            className={`rounded-full px-2 py-1 text-xs ${active ? tag.colorClass : 'bg-slate-100 text-slate-500'}`}
          >
            {tag.name}
          </button>
        );
      })}
    </div>
  );
};

export default TagPicker;
