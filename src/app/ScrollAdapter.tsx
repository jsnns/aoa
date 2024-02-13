"use client";

import { useEffect } from "react";

interface Props {}

/** Convert vertial scroll to horizontal scroll */
export const ScrollAdapter: React.FC<Props> = ({}) => {
  useEffect(() => {
    const reverseScroll = (e: WheelEvent) => {
      if (e.deltaY === 0) return;
      e.preventDefault();
      window.scrollBy(e.deltaY, 0);
    };

    document.body.addEventListener("wheel", reverseScroll);
  }, []);

  return null;
};
