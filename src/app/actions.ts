"use server";

import { supabase } from "@/lib/supabase";

export const submitPrediction = async (data: {
  month?: number;
  year: number;
}) => {
  await supabase.from("predictions").insert({
    phase_id: 1,
    year: data.year,
    month: data.month,
  });
};
