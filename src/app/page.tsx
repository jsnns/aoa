import { phases } from "@/data/phases";
import { Phase } from "./Phase";
import { ScrollAdapter } from "./ScrollAdapter";

export default function Home() {
  return (
    <main className="">
      <ScrollAdapter />
      <div className="grid grid-cols-3 h-[100svh] p-3 gap-3 w-[280vw] md:w-screen min-w-[1500px]">
        {phases.map((phase) => (
          <Phase phase={phase} key={phase.title} />
        ))}
      </div>
    </main>
  );
}
