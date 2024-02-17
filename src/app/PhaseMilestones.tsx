import { Checkbox } from "@/components/ui/checkbox";
import { Phase } from "@/data/phases";

interface Props {
  milestones: Phase["milestones"];
}

export const PhaseMilestones: React.FC<Props> = ({ milestones }) => {
  if (!milestones) {
    return null;
  }

  return (
    <div className="flex flex-col text-sm mt-3 gap-3">
      {milestones.map((milestone, i) => (
        <div className="items-top flex space-x-2" key={i}>
          <Checkbox checked={false} id={`milestone-${i}`} />
          <div className="grid gap-1.5 leading-none">
            <label
              htmlFor={`milestone-${i}`}
              className="text-sm font-medium -mt-[1px] peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {milestone}
            </label>
          </div>
        </div>
      ))}
    </div>
  );
};
