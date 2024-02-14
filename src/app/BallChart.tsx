"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { TooltipTrigger } from "@radix-ui/react-tooltip";
import { useMeasure } from "@uidotdev/usehooks";
import "./ballChart.css";

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
  const [ref, { height }] = useMeasure();
  const ballSize = 14;
  const ballSpacing = 1;
  const maxBallsPerColumn = Math.floor(
    (height || 0) / (ballSize + ballSpacing)
  );

  if (data.length === 0 || data.every((c) => c.value === 0)) {
    return null;
  }

  // normalize columns
  const max = Math.max(...data.map((c) => c.value));
  const columns = data.map((column) => ({
    ...column,
    value: Math.min(
      Math.floor((column.value / max) * maxBallsPerColumn),
      column.value
    ),
  }));

  // calculate max ball animation delay
  const maxAnimationDelay = Math.max(
    ...columns.map((column) => column.value * 100)
  );

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
                {Array.from({ length: column.value }).map((_, j) => (
                  <Ball
                    key={j}
                    size={ballSize}
                    color="black"
                    className="opacity-25 ball-enter"
                    style={{ animationDelay: `${(column.value - j) * 100}ms` }}
                  />
                ))}

                {column.value === 0 && (
                  <Ball size={ballSize} color="black" className="opacity-5" />
                )}

                {column.annotate && (
                  <div
                    className="h-full w-[2px] bg-black rounded-full absolute annotation-enter"
                    style={{
                      bottom: ballSpacing,
                      top: ballSpacing,
                      animationDelay: `${maxAnimationDelay + 350 + 400}ms`,
                    }}
                  >
                    <div
                      className="bg-black absolute top-0 text-[0.5rem] py-0.5 px-1 text-white annotation-enter"
                      style={{
                        [i < columns.length / 2 ? "left" : "right"]:
                          ballSpacing,
                        animationDelay: `${maxAnimationDelay + 350 + 400}ms`,
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

const Ball: React.FC<{
  size: number;
  color: string;
  className?: string;
  style?: React.CSSProperties;
}> = ({ size, color, className, style }) => {
  return (
    <div
      className={cn("rounded-full shrink-0 aspect-square", className || "")}
      style={{
        width: size,
        height: size,
        backgroundColor: color,
        ...style,
      }}
    />
  );
};
