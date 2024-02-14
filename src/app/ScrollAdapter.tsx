"use client";

import { useEffect } from "react";

interface Props {}

/** Convert vertial scroll to horizontal scroll */
export const ScrollAdapter: React.FC<Props> = ({}) => {
  useEffect(() => {
    const reverseScroll = (e: WheelEvent) => {
      if (e.deltaY === 0) return;

      e.preventDefault();
      const main = document.querySelector("main");
      if (main) {
        main.scrollBy(e.deltaY, 0);
        return;
      }
    };

    document.body.addEventListener("wheel", reverseScroll, { passive: false });

    return () => {
      document.body.removeEventListener("wheel", reverseScroll);
    };
  }, []);

  return null;
};
