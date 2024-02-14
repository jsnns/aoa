import { Tables } from "@/database.types";
import { useEffect, useState } from "react";
import { createBrowserClient } from "../supabase";

export const listenForPredictions = (
  phaseId: number,
  callback: (predictions: Tables<"predictions">) => void
) => {
  const subscription = createBrowserClient()
    .channel("schema-db-changes")
    .on(
      // @ts-ignore
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "predictions" },
      (data) => {
        if ((data.new as Tables<"predictions">).phase_id !== phaseId) return;
        callback(data.new as Tables<"predictions">);
      }
    )
    .subscribe();

  return subscription;
};

export const useLivePredictions = (
  phaseId: number,
  initialPredictions: Tables<"predictions">[] | null
) => {
  const [predictions, setPredictions] = useState<Tables<"predictions">[]>(
    initialPredictions || []
  );

  useEffect(() => {
    const sub = listenForPredictions(phaseId, (newPrediction) => {
      setPredictions((a) => [...a, newPrediction]);
    });

    return () => {
      sub.unsubscribe();
    };
  }, [phaseId]);

  return predictions;
};
