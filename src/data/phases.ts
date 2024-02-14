export const phases = [
  {
    supabaseId: 1,
    sequence: 1,
    slug: "digital-agi",
    title: "Digital AGI",
    summary:
      "A human level brain, run in the cloud, accessible by API and chat.",
    how_it_starts:
      "AGI is released by an AGI lab to much fanfare, then nothing seems to happen for several months. All at once society breaks under the pressure from human knowledge and creative work being economically worthless.",
    limitations:
      "GDP growth is limited by energy and compute. Access to AGI is not evenly distributed and largely still tied to economic resources.",
    capabilities: `AGI can perform any digital task at the level of an expert human. Writing code, animation, video editing, marketing, shopping, event planning, etc. Mangers, founders, and directors create by conducting orchestras of agents that code, act, animate, write, produce, design, and deliver their vision.`,
    life: "It's no longer clear what anyone's purpose is so most people suffer significant existential dread. It's not possible to plan more then a few months in the future.",
    money:
      "Human knowledge and creative work are economically worthless. GDP growth soars while human productivity collapses. For the first time humans produce less then we consume. High deflation is the new normal.",
    culture:
      "Education and the structure of late adolescence require urgent attention. Significant tension and fighting between former knowledge and creative workers and everyone else about how to relieve economic pressure. Individualism continues to dominate policy.",
  },
  {
    supabaseId: 2,
    sequence: 2,
    slug: "physical-agi",
    title: "Physical AGI",
    summary: "",
    how_it_starts: "",
    limitations: "",
    capabilities: ``,
    life: "",
    money: "",
    culture: "",
  },
  {
    supabaseId: 3,
    sequence: 2,
    slug: "industrial-agi",
    title: "Industrial AGI",
    summary: "",
    how_it_starts: "",
    limitations: "",
    capabilities: ``,
    life: "",
    money: "",
    culture: "",
  },
];

export type Phase = (typeof phases)[number];

export const getPhaseBySlug = (slug: string) => {
  return phases.find((phase) => phase.slug === slug);
};
