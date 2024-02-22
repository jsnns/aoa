import { phases } from "@/data/phases";
import { supabase } from "@/lib/supabase";
import { Metadata } from "next";
import { Phase } from "./Phase";
import { ScrollAdapter } from "./ScrollAdapter";

export const revalidate = 60; // get new data each minute to make it interesting to refresh for now, once we have a stable stream of data we can increase this

export default function Home() {
  return (
    <main className="flex justify-center flex-col h-[100svh] overflow-y-hidden">
      <ScrollAdapter />

      {/* SEO */}
      <h1 className="hidden">Three upcoming Eras of AI</h1>

      <div className="grid grid-cols-3 h-[100svh] p-3 gap-3 w-[270vw] md:w-screen md:min-w-[1500px]">
        {phases.map((phase) => (
          <Phase phase={phase} key={phase.title} />
        ))}
      </div>
    </main>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const { data: predictions } = await supabase.from("predictions").select();

  const title = `Eras of AI | ${predictions?.length} Predictions`;
  const description = `Digital, physical, then industrial AGI is coming. Checkout ${predictions?.length} predictions about how long it will take.`;

  return {
    metadataBase: new URL(process.env.DOMAIN || ""),
    title,
    description,
    openGraph: {
      images: ["/og?phase=digital-agi"],
      title,
      description,
      type: "website",
      url: new URL(process.env.DOMAIN || ""),
    },
    twitter: {
      images: ["/og?phase=digital-agi"],
      title,
      description,
    },
  };
}
