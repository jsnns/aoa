"use server";

import { Phase } from "@/data/phases";
import {
  averageDuration,
  datetimeFromAverageDuration,
  getPredictions,
  predictionsToDurationFromNow,
} from "@/lib/predictions/aggregate";
import { supabase } from "@/lib/supabase";
import { PhasePredictionForm } from "./PhasePredictionForm";
import { submitPrediction } from "./actions";
import { PhasePredictionPopover } from "./PhasePredictionPopover";

interface Props {
  phase: Phase;
}

export const PhasePrediction: React.FC<Props> = async ({ phase }) => {
  const predictions = await getPredictions(phase.supabaseId);

  if (!predictions) {
    return <div>No predictions</div>;
  }

  const durations = predictionsToDurationFromNow(predictions);
  const average = averageDuration(durations);
  const arrival = datetimeFromAverageDuration(average);

  return (
    <>
      <p className="">
        <span className="text-sm opacity-50">
          {phase.title} will arrive in{" "}
        </span>
        <br />
        <span className="text-xl">
          {arrival.toFormat("MMM")} {arrival.year}
        </span>
      </p>

      <PhasePredictionPopover
        phaseId={phase.supabaseId}
        submit={submitPrediction}
      />
    </>
  );
};
