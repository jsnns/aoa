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
          color: "hsl(222.2 84% 4.9%)",
          background: "hsl(210 40% 98%)",
          width: "100%",
          height: "100%",
          padding: "50px 100px",
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
            <circle cx="12" cy="12" r="12" fill="#00000025" />
          </svg>
          <svg width="24" height="24">
            <circle cx="12" cy="12" r="12" fill="#00000050" />
          </svg>
          <svg width="24" height="24">
            <circle cx="12" cy="12" r="12" fill="#00000075" />
          </svg>
        </div>
        <p style={{ fontSize: 64 }}>
          {phase.title} by {medianPrediction.toFormat("MMM yyyy")}
        </p>
        <p style={{ fontSize: 32 }}>{phase.summary}</p>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
