"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { Phase } from "@/data/phases";
import { cn } from "@/lib/utils";
import { TooltipTrigger } from "@radix-ui/react-tooltip";
import { useMeasure } from "@uidotdev/usehooks";

interface Props {
  data: BallChartColumn[];
}

export interface BallChartColumn {
  columnTitle: string;
  value: number;
  tooltip?: string;
  annotate?: {
    text: string;
  };
}

export const BallChart: React.FC<Props> = ({ data }) => {
  const [ref, { width, height }] = useMeasure();
  const ballSize = 12;
  const ballSpacing = 1;
  const maxBallsPerColumn = Math.floor(
    (height || 0) / (ballSize + ballSpacing)
  );

  // normalize columns
  const max = Math.max(...data.map((c) => c.value));
  const columns = data.map((column) => ({
    ...column,
    value: Math.floor((column.value / max) * maxBallsPerColumn),
  }));

  return (
    <div
      ref={ref}
      className="flex flex-row w-full h-full items-center relative"
      style={{ gap: ballSpacing }}
    >
      {columns.map((column, i) => (
        <TooltipProvider key={i}>
          <Tooltip delayDuration={0}>
            <TooltipTrigger>
              <div
                className="flex flex-col items-center"
                style={{ gap: ballSpacing }}
              >
                {Array.from({ length: column.value }).map((_, i) => (
                  <Ball key={i} size={ballSize} color="black" className="" />
                ))}

                {column.value === 0 && (
                  <Ball size={ballSize} color="black" className="opacity-10" />
                )}

                {column.annotate && (
                  <div
                    className="h-full w-[2px] bg-black rounded-full absolute"
                    style={{
                      bottom: ballSpacing,
                      top: ballSpacing,
                    }}
                  >
                    <div
                      className="bg-black absolute top-0 text-[0.5rem] py-0.5 px-1 text-white"
                      style={{
                        [i < columns.length / 2 ? "left" : "right"]:
                          ballSpacing,
                      }}
                    >
                      {column.annotate.text}
                    </div>
                  </div>
                )}
              </div>
            </TooltipTrigger>

            <TooltipContent>
              <p className="font-semibold">{column.columnTitle}</p>
              {column.tooltip && <p>{column.tooltip}</p>}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
    </div>
  );
};

const Ball: React.FC<{ size: number; color: string; className?: string }> = ({
  size,
  color,
  className,
}) => {
  return (
    <div
      className={cn("rounded-full shrink-0 aspect-square", className || "")}
      style={{
        width: size,
        height: size,
        backgroundColor: color,
      }}
    />
  );
};
