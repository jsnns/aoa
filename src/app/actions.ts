"use server";

import { supabase } from "@/lib/supabase";

export const submitPrediction = async (data: {
  month?: number;
  year: number;
  phaseId: number;
}) => {
  await supabase.from("predictions").insert({
    phase_id: data.phaseId,
    year: data.year,
    month: data.month,
  });
};
