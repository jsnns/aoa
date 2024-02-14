"use server";

import { Card } from "@/components/ui/card";
import { Phase as PhaseType } from "@/data/phases";
import { getPredictions } from "@/lib/predictions/aggregate";
import { PhaseColumn } from "./PhaseColumn";
import { PhasePrediction } from "./PhasePrediction";
import { PhasePredictionChart } from "./PhasePredictionChart";

interface Props {
  phase: PhaseType;
}

export const Phase: React.FC<Props> = async ({ phase }) => {
  const predictions = await getPredictions(phase.supabaseId);

  return (
    <div
      className="flex flex-col justify-between max-h-full overflow-y-hidden relative h-full"
      key={phase.sequence}
    >
      <div className="p-2 shrink flex overflow-y-auto">
        <PhaseColumn phase={phase} />
      </div>

      <Card className="py-3 px-5 hover:absolute active:absolute bottom-0 left-0 right-0 group flex flex-col gap-5 shrink-0">
        <div className="group-hover:flex hidden max-w-full">
          <PhasePredictionChart
            phase={phase}
            className="h-24 w-full overflow-x-auto"
            predictionData={predictions}
          />
        </div>

        <div className="flex flex-row justify-between items-center">
          <PhasePrediction phase={phase} />
        </div>
      </Card>
    </div>
  );
};
