import { PhaseDetails } from "@/app/PhaseDetails";
import { PhaseHeader } from "@/app/PhaseHeader";
import { PhaseMilestones } from "@/app/PhaseMilestones";
import { PhasePredictionChart } from "@/app/PhasePredictionChart";
import { Card } from "@/components/ui/card";
import { getPhaseBySlug } from "@/data/phases";
import { getPredictions } from "@/lib/predictions/aggregate";
import type { Metadata } from "next";

interface Props {
  params: { phase: string };
}

export const revalidate = 60; // 1 minute

export default async function Page({ params }: Props) {
  const phase = getPhaseBySlug(params.phase);

  if (!phase) {
    return <div>Phase not found</div>;
  }

  const predictions = await getPredictions(phase.supabaseId);

  return (
    <main className="grid grid-cols-2 h-[100svh] p-3 gap-3 w-[180vw] md:w-screen md:min-w-[1500px] overflow-y-hidden">
      <Card className="p-5 md:row-span-3 overflow-y-auto flex flex-col gap-2">
        <PhaseHeader phase={phase} />
        <PhaseMilestones milestones={phase.milestones} />
        {phase.culture && <PhaseDetails phase={phase} />}
      </Card>

      <Card className="h-full w-full md:col-span-2 md:row-span-3 p-2 overflow-x-hidden">
        <PhasePredictionChart
          phase={phase}
          predictionData={predictions}
          className="h-full w-full"
          thresholds={{
            decade: 12 * 100,
            year: 12 * 25,
            quarter: 12 * 10,
          }}
        />
      </Card>
    </main>
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const phase = getPhaseBySlug(params.phase);

  if (!phase) {
    return { title: "Phase not found" };
  }

  return {
    metadataBase: new URL(process.env.DOMAIN || ""),
    title: phase.title,
    description: phase.summary,
    openGraph: {
      images: [`/og?phase=${phase.slug}`],
    },
  };
}
