"use server";

import { Card } from "@/components/ui/card";
import { Phase as PhaseType } from "@/data/phases";
import { getPredictions } from "@/lib/predictions/aggregate";
import Link from "next/link";
import { PhaseHeader } from "./PhaseHeader";
import { PhasePrediction } from "./PhasePrediction";
import { PhasePredictionChart } from "./PhasePredictionChart";

interface Props {
  phase: PhaseType;
}

export const Phase: React.FC<Props> = async ({ phase }) => {
  const predictions = await getPredictions(phase.supabaseId);

  return (
    <Card
      className="flex flex-col justify-between max-h-full overflow-y-hidden relative h-full max-w-[90vw] rounded-3xl items-center gap-4 py-4"
      key={phase.sequence}
    >
      <div className="shrink-0 flex overflow-y-auto flex-col gap-2 px-4">
        <PhaseHeader phase={phase} />
        <Link
          href={`/phase/${phase.slug}`}
          className="text-sm underline underline-offset-1 opacity-75"
        >
          Read More
        </Link>
      </div>

      <PhasePredictionChart
        phase={phase}
        className="w-full overflow-y-auto overflow-x-hidden"
        predictionData={predictions}
      />

      <PhasePrediction phase={phase} />
    </Card>
  );
};
