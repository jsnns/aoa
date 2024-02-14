import { Tables } from "@/database.types";
import { DateTime } from "luxon";
import { supabase } from "../supabase";

export const getPredictions = async (phaseId: number) => {
  const { data } = await supabase
    .from("predictions")
    .select("*")
    .eq("phase_id", phaseId);

  return data;
};

export const predictionsToDateTime = (predictions: Tables<"predictions">[]) => {
  return predictions.map((prediction) => {
    return DateTime.fromObject({
      year: prediction.year,
      month: prediction.month,
    });
  });
};

export const predictionsToDurationFromNow = (
  predictions: Tables<"predictions">[]
) => {
  return predictionsToDateTime(predictions).map((datetime) => {
    return datetime.diffNow("years");
  });
};

export const averageDuration = (durations: luxon.Duration[]) => {
  if (durations.length === 0) return 0;
  return durations.reduce((a, b) => a + b.years, 0) / durations.length;
};

export const datetimeFromAverageDuration = (years: number) => {
  return DateTime.now().plus({ years });
};

export const furthestPrediction = (predictions: Tables<"predictions">[]) => {
  if (predictions.length === 0) {
    return DateTime.now();
  }

  const durations = predictionsToDurationFromNow(predictions);
  const max = Math.max(...durations.map((d) => d.years));

  return datetimeFromAverageDuration(max);
};
