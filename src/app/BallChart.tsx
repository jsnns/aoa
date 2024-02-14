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
                    color=""
                    className="opacity-75 ball-enter bg-primary"
                    style={{ animationDelay: `${(column.value - j) * 100}ms` }}
                  />
                ))}

                {column.value === 0 && (
                  <Ball
                    size={ballSize}
                    color=""
                    className="opacity-10 bg-foreground"
                  />
                )}

                {column.annotate && (
                  <div className="absolute top-0 bottom-0">
                    <div
                      className="w-[1px] bg-foreground bg-opacity-50 rounded-full absolute annotation-enter top-8 bottom-8"
                      style={{
                        bottom: ballSpacing,
                        top: ballSpacing + 8,
                        animationDelay: `${maxAnimationDelay + 350 + 400}ms`,
                      }}
                    />
                    <div
                      className={cn(
                        "bg-foreground absolute top-0 text-[0.5rem] py-0.5 text-background annotation-enter",
                        {
                          "rounded-r-md rounded-tl-md pr-1.5 pl-1":
                            i < columns.length / 2,
                          "rounded-l-md rounded-tr-md pl-1.5 pr-1":
                            i >= columns.length / 2,
                        }
                      )}
                      style={{
                        [i < columns.length / 2 ? "left" : "right"]: -1,
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
