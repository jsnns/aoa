import { PhasePredictionChart } from "@/app/PhasePredictionChart";
import { Card } from "@/components/ui/card";
import { getPhaseBySlug } from "@/data/phases";
import { getPredictions } from "@/lib/predictions/aggregate";

interface Props {
  params: { phase: string };
}

export default async function Page({ params }: Props) {
  const phase = getPhaseBySlug(params.phase);

  if (!phase) {
    return <div>Phase not found</div>;
  }

  const predictions = await getPredictions(phase.supabaseId);

  return (
    <main className="p-3 flex flex-col h-[100svh] gap-10">
      <Card className="p-3">
        <h1 className="text-xl font-semibold">{phase.title}</h1>
        <p>{phase.summary}</p>
      </Card>

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
    </main>
  );
}
