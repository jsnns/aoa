"use client";

import { Phase } from "@/data/phases";
import { Tables } from "@/database.types";
import {
  medianPredictionDateTime,
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
  const median = medianPredictionDateTime(updatedPredictions);

  return (
    <p className="text-sm text-center" key={updatedPredictions.length}>
      <span className="opacity-30">{phase.title} arrives in</span>
      <br />
      <span className="font-semibold">
        {median.toFormat("MMM")} {median.year}
      </span>{" "}
      ·{" "}
      <span className="opacity-50">
        {updatedPredictions.length.toLocaleString("en-us", {
          maximumFractionDigits: 0,
          compactDisplay: "short",
        })}{" "}
        predictions
      </span>
    </p>
  );
};
