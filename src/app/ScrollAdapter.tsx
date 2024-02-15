"use client";

import { useEffect } from "react";

interface Props {}

/** Convert vertial scroll to horizontal scroll */
export const ScrollAdapter: React.FC<Props> = ({}) => {
  useEffect(() => {
    const reverseScroll = (e: WheelEvent) => {
      if (e.deltaY === 0) return;

      // if the target or parent has a scrollbar, don't prevent default so the user can scroll vertically unless they have scrolled to the end and are trying to scroll further
      let target = e.target as HTMLElement;
      while (target !== document.body) {
        if (target.scrollHeight > target.clientHeight) {
          // this is the scrollable element, let's check to see if the user might want to interact with it before preventing default
          const atBottom =
            Math.abs(
              target.scrollHeight - target.clientHeight - target.scrollTop
            ) <= 1;
          const atTop = target.scrollTop <= 1;

          console.log(atTop, e.deltaY < 0);

          if (atBottom && e.deltaY > 0) {
            break;
          }

          if (atTop && e.deltaY < 0) {
            break;
          }

          return;
        }
        target = target.parentElement!;
      }

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
