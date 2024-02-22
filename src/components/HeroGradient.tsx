"use client";

import React from "react";

interface Props {
  colors?: string[];
  darkenTop?: boolean;
}

export const rbgaStringToHex = (rgba: string) => {
  if (!rgba.includes("rgba")) return rgba;
  const [r, g, b, a] = rgba
    .replace("rgba(", "")
    .replace(")", "")
    .split(",")
    .map((n) => parseInt(n, 10));

  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
};

export const HeroGradient: React.FC<Props> = ({ colors }) => {
  const [hasLoaded, setHasLoaded] = React.useState(false);

  React.useEffect(() => {
    const init = async () => {
      if (hasLoaded) return;
      try {
        // @ts-ignore
        await import("./Gradient.js");

        if (colors?.length) {
          // @ts-ignore
          new Gradient({
            canvas: "#gradient-canvas",
            colors: colors?.map((color) => rbgaStringToHex(color)),
            amplitude: 1000,
            density: [0.01, 0.16, 0.5],
          });
        }
      } catch (error) {
        console.log(error);
      }
      setHasLoaded(true);
    };
    init();
  }, [colors, hasLoaded]);

  return (
    <canvas
      id="gradient-canvas"
      data-transition-in
      className="fade-in w-screen h-[100svh]"
    />
  );
};
