import { Phase } from "@/data/phases";
import Link from "next/link";

interface Props {
  phase: Phase;
}

export const PhaseHeader: React.FC<Props> = ({ phase }) => {
  return (
    <>
      <Link href={`/phase/${phase.slug}`}>
        <h2 className="opacity-40 font-medium">
          Era {phase.sequence}: {phase.title}
        </h2>
      </Link>
      <p className="font-medium">{phase.summary}</p>
    </>
  );
};
