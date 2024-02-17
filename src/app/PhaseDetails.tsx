import { Phase } from "@/data/phases";

interface Props {
  phase: Phase;
}

export const PhaseDetails: React.FC<Props> = ({ phase }) => {
  const headingStyle = "opacity-40 mt-5";

  return (
    <>
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
    </>
  );
};
