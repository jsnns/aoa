import { getPhaseBySlug } from "@/data/phases";
import {
  getPredictions,
  medianPredictionDateTime,
} from "@/lib/predictions/aggregate";
import { ImageResponse } from "next/og";
import { NextResponse } from "next/server";
// App router includes @vercel/og.
// No need to install it.

export const runtime = "edge";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const phaseSlug = searchParams.get("phase");

  const phase = getPhaseBySlug(phaseSlug || "");

  if (!phase) {
    return NextResponse.error();
  }

  const predictions = await getPredictions(phase.supabaseId);
  const medianPrediction = medianPredictionDateTime(predictions || []);

  return new ImageResponse(
    (
      <div
        style={{
          color: "hsl(210 40% 98%)",
          background: "hsl(222.2 84% 4.9%)",
          width: "100%",
          height: "100%",
          padding: "50px 200px",
          textAlign: "center",
          justifyContent: "center",
          alignItems: "center",
          display: "flex",
          flexDirection: "column",
          gap: 5,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 10,
          }}
        >
          <svg width="24" height="24">
            <circle
              cx="12"
              cy="12"
              r="12"
              fill="hsl(210 40% 98%)"
              opacity={0.3}
            />
          </svg>
          <svg width="24" height="24">
            <circle
              cx="12"
              cy="12"
              r="12"
              fill="hsl(210 40% 98%)"
              opacity={0.6}
            />
          </svg>
          <svg width="24" height="24">
            <circle cx="12" cy="12" r="12" fill="hsl(210 40% 98%)" />
          </svg>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            alignItems: "center",
          }}
        >
          <p style={{ fontSize: 32, marginBottom: 0, opacity: 0.5 }}>
            Based on{" "}
            {(predictions?.length || 0).toLocaleString(undefined, {
              maximumFractionDigits: 0,
            })}{" "}
            predictions
          </p>
          <p style={{ fontSize: 64, marginTop: 0 }}>
            {phase.title} by {medianPrediction.toFormat("MMM yyyy")}
          </p>
        </div>
        <p style={{ fontSize: 32 }}>{phase.summary}</p>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
