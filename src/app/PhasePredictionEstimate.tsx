"use client";

import { Phase } from "@/data/phases";
import { Tables } from "@/database.types";
import {
  averageDuration,
  datetimeFromAverageDuration,
  predictionsToDurationFromNow,
} from "@/lib/predictions/aggregate";
import { useLivePredictions } from "@/lib/predictions/livePredictions";

interface Props {
  phase: Phase;
  predictions: Tables<"predictions">[];
}

export const PhasePredictionEstimate: React.FC<Props> = ({
  phase,
  predictions,
}) => {
  const updatedPredictions = useLivePredictions(phase.supabaseId, predictions);

  if (!predictions) {
    return <div>No predictions</div>;
  }

  const durations = predictionsToDurationFromNow(updatedPredictions);
  const average = averageDuration(durations);
  const arrival = datetimeFromAverageDuration(average);

  return (
    <p className="" key={updatedPredictions.length}>
      <span className="text-sm opacity-50">{phase.title} will arrive in </span>
      <br />
      <span className="text-xl">
        {arrival.toFormat("MMM")} {arrival.year}
      </span>{" "}
      <span className="text-sm opacity-50">
        {updatedPredictions.length.toLocaleString("en-us", {
          maximumFractionDigits: 0,
          compactDisplay: "short",
        })}
        x
      </span>
    </p>
  );
};
