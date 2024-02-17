"use server";

import { Card } from "@/components/ui/card";
import { Phase as PhaseType } from "@/data/phases";
import { getPredictions } from "@/lib/predictions/aggregate";
import { PhaseDetails } from "./PhaseDetails";
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
      className="flex flex-col justify-between max-h-full overflow-y-hidden relative h-full max-w-[90vw] p-3 rounded-3xl"
      key={phase.sequence}
    >
      <div className="p-2 shrink flex overflow-y-auto flex-col gap-2">
        <PhaseHeader phase={phase} />
        {phase.culture && <PhaseDetails phase={phase} />}
      </div>

      <div className="flex flex-col gap-5 shrink-0 p-2">
        <div className="max-w-full">
          <PhasePredictionChart
            phase={phase}
            className="h-24 w-full overflow-x-auto"
            predictionData={predictions}
          />
        </div>

        <div className="flex flex-row justify-between items-end">
          <PhasePrediction phase={phase} />
        </div>
      </div>
    </Card>
  );
};
