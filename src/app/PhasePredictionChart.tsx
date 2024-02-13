"use server";

import { Phase } from "@/data/phases";
import {
  averageDuration,
  datetimeFromAverageDuration,
  furthestPrediction,
  getPredictions,
  predictionsToDurationFromNow,
} from "@/lib/predictions/aggregate";
import { cn } from "@/lib/utils";
import { BallChart } from "./BallChart";
import { Tables } from "@/database.types";
import { DateTime } from "luxon";

interface Props {
  phase: Phase;
  className?: string;
}

export const bucketByMonthAndYear = (
  predictions: Tables<"predictions">[]
): { month: number; year: number; count: number }[] => {
  // add missing months
  const first = DateTime.now();
  const last = furthestPrediction(predictions);

  const buckets = predictions.reduce((acc, prediction) => {
    const key = `${prediction.year}-${prediction.month}`;
    if (acc[key]) {
      acc[key].count++;
    } else {
      acc[key] = { month: prediction.month, year: prediction.year, count: 1 };
    }
    return acc;
  }, {} as Record<string, { month: number; year: number; count: number }>);

  const allBuckets = allBucketsBetween(first, last);

  allBuckets.forEach((bucket) => {
    const key = `${bucket.year}-${bucket.month}`;
    if (!buckets[key]) {
      buckets[key] = { month: bucket.month, year: bucket.year, count: 0 };
    }
  });

  return Object.values(buckets);
};

export const allBucketsBetween = (
  start: DateTime,
  end: DateTime
): { month: number; year: number }[] => {
  const buckets = [];
  let current = start;
  while (current <= end) {
    buckets.push({ month: current.month, year: current.year });
    current = current.plus({ months: 1 });
  }
  return buckets;
};

export const PhasePredictionChart: React.FC<Props> = async ({
  phase,
  className,
}) => {
  const predictions = await getPredictions(phase.supabaseId);
  if (!predictions || predictions.length === 0) {
    return null;
  }

  const averagePrediction = datetimeFromAverageDuration(
    averageDuration(predictionsToDurationFromNow(predictions))
  );

  const buckets = bucketByMonthAndYear(predictions);

  buckets.sort((a, b) => {
    if (a.year === b.year) {
      return a.month - b.month;
    }
    return a.year - b.year;
  });

  const columns = buckets.map((bucket) => {
    return {
      columnTitle: DateTime.fromObject({
        year: bucket.year,
        month: bucket.month,
      }).toFormat("MMMM yyyy"),
      tooltip: `${bucket.count} predictions`,
      value: bucket.count,
      annotate:
        bucket.year === averagePrediction.year &&
        bucket.month === averagePrediction.month
          ? { text: "avg" }
          : undefined,
    };
  });

  return (
    <div className={cn(className)}>
      <BallChart data={columns} />
    </div>
  );
};
