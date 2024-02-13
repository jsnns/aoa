import { phases } from "@/data/phases";
import { PhaseColumn } from "./PhaseColumn";
import { PhasePrediction } from "./PhasePrediction";
import { Card } from "@/components/ui/card";
import { ScrollAdapter } from "./ScrollAdapter";
import { BallChart } from "./BallChart";
import { PhasePredictionChart } from "./PhasePredictionChart";

export default function Home() {
  return (
    <main className="">
      <ScrollAdapter />
      <div className="grid grid-cols-3 h-[100svh] p-3 gap-3 w-[300vw] md:w-screen min-w-[1500px]">
        {phases.map((phase) => (
          <div
            className="flex flex-col justify-between max-h-full overflow-y-auto relative"
            key={phase.sequence}
          >
            <div className="p-2">
              <PhaseColumn phase={phase} />
            </div>

            <Card className="py-3 px-5 hover:absolute active:absolute bottom-0 left-0 right-0 group flex flex-col gap-5">
              <div className="group-hover:flex hidden w-full">
                <PhasePredictionChart phase={phase} className="h-24" />
              </div>

              <div className="flex flex-row justify-between items-center">
                <PhasePrediction phase={phase} />
              </div>
            </Card>
          </div>
        ))}
      </div>
    </main>
  );
}
