import { phases } from "@/data/phases";
import { Phase } from "./Phase";
import { ScrollAdapter } from "./ScrollAdapter";

export default function Home() {
  return (
    <main className="flex justify-center flex-col h-[100svh]">
      <ScrollAdapter />

      <div className="grid grid-cols-3 max-h-[100svh] p-3 gap-3 w-[270vw] md:w-screen md:min-w-[1500px]">
        {phases.map((phase) => (
          <Phase phase={phase} key={phase.title} />
        ))}
      </div>
    </main>
  );
}
