import { Project } from '../types/task';

interface ProjectPickerProps {
  value: string;
  projects: Project[];
  onChange: (value: string) => void;
}

const ProjectPicker = ({ value, projects, onChange }: ProjectPickerProps) => {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
    >
      {projects.map((project) => (
        <option key={project.id} value={project.id}>
          {project.name}
        </option>
      ))}
    </select>
  );
};

export default ProjectPicker;
