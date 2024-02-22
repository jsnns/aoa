"use client";

import { Phase } from "@/data/phases";
import { Tables } from "@/database.types";
import {
  furthestPrediction,
  medianPredictionDateTime,
} from "@/lib/predictions/aggregate";
import { useLivePredictions } from "@/lib/predictions/livePredictions";
import { removeOutlierPredictions } from "@/lib/predictions/quality";
import { cn } from "@/lib/utils";
import { DateTime } from "luxon";
import { useEffect, useState } from "react";
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
  medianPrediction: DateTime
) => {
  const years = Array.from(new Set(buckets.map((b) => b.year)));

  return years.map((year) => {
    const yearBuckets = buckets.filter((b) => b.year === year);
    return {
      columnTitle: year.toString(),
      value: yearBuckets.reduce((acc, b) => acc + b.count, 0),
      annotate: year === medianPrediction.year ? { text: "median" } : undefined,
    };
  });
};

export const groupByQuarter = (
  buckets: { month: number; year: number; count: number }[],
  medianPrediction: DateTime
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
          year === medianPrediction.year &&
          quarterBuckets.some((b) => b.month === medianPrediction.month)
            ? { text: "median" }
            : undefined,
      };
    });
  });
};

export const groupByDecade = (
  buckets: { month: number; year: number; count: number }[],
  medianPrediction: DateTime
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
          b.year === medianPrediction.year && b.month === medianPrediction.month
      )
        ? { text: "median" }
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
  medianPrediction: DateTime,
  thresholds: BallChatBucketThresholds = {
    decade: 1000,
    year: 60,
    quarter: 24,
  }
): BallChartColumn[] => {
  if (buckets.length > thresholds.decade) {
    return groupByDecade(buckets, medianPrediction);
  }

  if (buckets.length > thresholds.year) {
    return groupByYear(buckets, medianPrediction);
  }

  if (buckets.length > thresholds.quarter) {
    return groupByQuarter(buckets, medianPrediction);
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
        bucket.year === medianPrediction.year &&
        bucket.month === medianPrediction.month
          ? { text: "median" }
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
  const [show, setShow] = useState(false);
  const predictions = useLivePredictions(phase.supabaseId, predictionData);

  useEffect(() => {
    if (predictions) {
      setShow(true);
    }
  }, [predictions]);

  if (!predictions || predictions.length === 0) {
    return null;
  }

  if (!show) {
    return null;
  }

  const medianPrediction = medianPredictionDateTime(predictions);

  const buckets = bucketByMonthAndYear(
    removeOutlierPredictions(predictions)
  ).filter(bucketIsNotInThePast);

  buckets.sort((a, b) => {
    if (a.year === b.year) {
      return a.month - b.month;
    }
    return a.year - b.year;
  });

  const columns = fitBuckets(buckets, medianPrediction, thresholds);

  return (
    <div className={cn(className)}>
      <BallChart data={columns} />
    </div>
  );
};
