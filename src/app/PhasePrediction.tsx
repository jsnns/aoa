"use server";

import { Phase } from "@/data/phases";
import { getPredictions } from "@/lib/predictions/aggregate";
import { PhasePredictionEstimate } from "./PhasePredictionEstimate";
import { PhasePredictionPopover } from "./PhasePredictionPopover";
import { submitPrediction } from "./actions";

interface Props {
  phase: Phase;
}

export const PhasePrediction: React.FC<Props> = async ({ phase }) => {
  const predictions = await getPredictions(phase.supabaseId);

  if (!predictions) {
    return <div>No predictions</div>;
  }

  return (
    <>
      <PhasePredictionEstimate phase={phase} predictions={predictions} />

      <PhasePredictionPopover
        phaseId={phase.supabaseId}
        submit={submitPrediction}
      />
    </>
  );
};
