import { Checkbox } from "@/components/ui/checkbox";
import { Phase } from "@/data/phases";

interface Props {
  phase: Phase;
  fullDetails?: boolean;
}

export const PhaseColumn: React.FC<Props> = ({ phase, fullDetails }) => {
  const headingStyle = "opacity-40 mt-5";

  return (
    <>
      <h2 className="opacity-40 font-medium">
        Era {phase.sequence}: {phase.title}
      </h2>
      <p className="font-medium">{phase.summary}</p>

      {phase.milestones && (
        <div className="flex flex-col text-sm mt-3 gap-3">
          {phase.milestones.map((milestone, i) => (
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
      )}

      {fullDetails && (
        <div className="flex flex-col text-sm mt-3">
          <h3 className={headingStyle}>How it starts</h3>
          <p>{phase.how_it_starts}</p>

          <h3 className={headingStyle}>Limitations</h3>
          <p>{phase.limitations}</p>

          <h3 className={headingStyle}>Capabilities</h3>
          <p>{phase.capabilities}</p>

          <h3 className={headingStyle}>Life</h3>
          <p>{phase.life}</p>

          <h3 className={headingStyle}>Money</h3>
          <p>{phase.money}</p>

          <h3 className={headingStyle}>Culture</h3>
          <p>{phase.culture}</p>
        </div>
      )}
    </>
  );
};
