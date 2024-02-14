"use client";

import { Phase } from "@/data/phases";
import { Tables } from "@/database.types";
import {
  averageDuration,
  datetimeFromAverageDuration,
  furthestPrediction,
  predictionsToDurationFromNow,
} from "@/lib/predictions/aggregate";
import { useLivePredictions } from "@/lib/predictions/livePredictions";
import { removeOutlierPredictions } from "@/lib/predictions/quality";
import { cn } from "@/lib/utils";
import { DateTime } from "luxon";
import { BallChart, BallChartColumn } from "./BallChart";

interface Props {
  phase: Phase;
  className?: string;
  predictionData: Tables<"predictions">[] | null;
  thresholds?: BallChatBucketThresholds;
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

export const groupByYear = (
  buckets: { month: number; year: number; count: number }[],
  averagePrediction: DateTime
) => {
  const years = Array.from(new Set(buckets.map((b) => b.year)));

  return years.map((year) => {
    const yearBuckets = buckets.filter((b) => b.year === year);
    return {
      columnTitle: year.toString(),
      value: yearBuckets.reduce((acc, b) => acc + b.count, 0),
      annotate: year === averagePrediction.year ? { text: "avg" } : undefined,
    };
  });
};

export const groupByQuarter = (
  buckets: { month: number; year: number; count: number }[],
  averagePrediction: DateTime
) => {
  const years = Array.from(new Set(buckets.map((b) => b.year)));

  return years.flatMap((year) => {
    const yearBuckets = buckets.filter((b) => b.year === year);
    const quarters = [1, 4, 7, 10];
    return quarters.map((quarter) => {
      const quarterBuckets = yearBuckets.filter(
        (b) => b.month >= quarter && b.month < quarter + 3
      );
      return {
        columnTitle: `Q${Math.floor(quarter / 3) + 1} ${year}`,
        value: quarterBuckets.reduce((acc, b) => acc + b.count, 0),
        annotate:
          year === averagePrediction.year &&
          quarterBuckets.some((b) => b.month === averagePrediction.month)
            ? { text: "avg" }
            : undefined,
      };
    });
  });
};

export const groupByDecade = (
  buckets: { month: number; year: number; count: number }[],
  averagePrediction: DateTime
) => {
  const startYear = buckets[0].year - (buckets[0].year % 10);
  const endYear =
    buckets[buckets.length - 1].year + (10 - (buckets[0].year % 10));

  const decades = Array.from(
    { length: Math.ceil((endYear - startYear) / 10) },
    (_, i) => startYear + i * 10
  );

  return decades.map((decade) => {
    const decadeBuckets = buckets.filter(
      (b) => b.year >= decade && b.year < decade + 10
    );
    return {
      columnTitle: `${decade}s`,
      value: decadeBuckets.reduce((acc, b) => acc + b.count, 0),
      annotate: decadeBuckets.some(
        (b) =>
          b.year === averagePrediction.year &&
          b.month === averagePrediction.month
      )
        ? { text: "avg" }
        : undefined,
    };
  });
};

interface BallChatBucketThresholds {
  decade: number;
  year: number;
  quarter: number;
}

export const fitBuckets = (
  buckets: { month: number; year: number; count: number }[],
  averagePrediction: DateTime,
  thresholds: BallChatBucketThresholds = {
    decade: 120,
    year: 60,
    quarter: 24,
  }
): BallChartColumn[] => {
  if (buckets.length > thresholds.decade) {
    return groupByDecade(buckets, averagePrediction);
  }

  if (buckets.length > thresholds.year) {
    return groupByYear(buckets, averagePrediction);
  }

  if (buckets.length > thresholds.quarter) {
    return groupByQuarter(buckets, averagePrediction);
  }

  return buckets.map((bucket) => {
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
};

export const bucketIsNotInThePast = (bucket: {
  month: number;
  year: number;
  count: number;
}) => {
  const now = DateTime.now();
  const bucketDate = DateTime.fromObject({
    year: bucket.year,
    month: bucket.month,
  });
  return bucketDate > now;
};

export const PhasePredictionChart: React.FC<Props> = ({
  phase,
  className,
  predictionData,
  thresholds,
}) => {
  const predictions = useLivePredictions(phase.supabaseId, predictionData);

  if (!predictions || predictions.length === 0) {
    return null;
  }

  const averagePrediction = datetimeFromAverageDuration(
    averageDuration(predictionsToDurationFromNow(predictions))
  );

  const buckets = bucketByMonthAndYear(
    removeOutlierPredictions(predictions)
  ).filter(bucketIsNotInThePast);

  buckets.sort((a, b) => {
    if (a.year === b.year) {
      return a.month - b.month;
    }
    return a.year - b.year;
  });

  const columns = fitBuckets(buckets, averagePrediction, thresholds);

  return (
    <div className={cn(className)}>
      <BallChart data={columns} />
    </div>
  );
};
