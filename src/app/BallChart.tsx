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
  const [ref, { height, width }] = useMeasure();
  const ballSize = 8;
  const ballSpacing = 2;

  const maxBallsPerColumn = Math.floor((width || 0) / (ballSize + ballSpacing));
  const maxColumns = Math.floor((height || 0) / (ballSize + ballSpacing));
  if (data.length === 0 || data.every((c) => c.value === 0)) {
    return null;
  }

  // normalize columns
  const max = Math.max(...data.map((c) => c.value));
  const columns = data.map((column) => ({
    ...column,
    value: Math.min(
      Math.floor((column.value / max) * maxBallsPerColumn),
      column.value * 2
    ),
    previousValue: column.value,
  }));

  // calculate max ball animation delay
  const maxAnimationDelay = Math.max(
    ...columns.map((column) => column.value * 100)
  );

  const emptyColumns = maxColumns - columns.length;
  if (emptyColumns > 0) {
    for (let i = 0; i < emptyColumns; i++) {
      columns.push({ columnTitle: "", value: 0, previousValue: 0 });
    }
  }

  return (
    <div
      ref={ref}
      className="flex flex-col w-full h-full items-start relative justify-start"
      style={{ gap: ballSpacing }}
    >
      {columns.map((column, i) => (
        <TooltipProvider key={i}>
          <Tooltip delayDuration={0}>
            <TooltipTrigger className="w-full flex flex-col items-center justify-center hover:bg-white hover:bg-opacity-10">
              <div
                className="flex flex-row items-center justify-center w-full"
                style={{ gap: ballSpacing }}
              >
                {column.annotate && (
                  // flag
                  <div
                    className="absolute left-0 right-0 bg-white bg-opacity-10 annotation-enter flex flex-row items-center justify-start px-2"
                    style={{
                      height: ballSize + ballSpacing,
                      animationDelay: `${maxAnimationDelay + 500}ms`,
                    }}
                  >
                    <p className="text-[9px] uppercase opacity-70 font-semibold">
                      {column.annotate.text}
                    </p>
                  </div>
                )}

                {Array.from({ length: column.value }).map((_, j) => (
                  <Ball
                    key={j}
                    size={ballSize}
                    color=""
                    className="ball-enter bg-primary"
                    style={{ animationDelay: `${(column.value - j) * 100}ms` }}
                  />
                ))}

                {column.value === 0 && (
                  <Ball
                    size={ballSize}
                    color=""
                    className="opacity-25 bg-foreground empty-ball-enter"
                    style={{ animationDelay: `${maxAnimationDelay + 1000}ms` }}
                  />
                )}
              </div>
            </TooltipTrigger>

            {column.columnTitle && (
              <TooltipContent>
                <p className="font-semibold">{column.columnTitle}</p>
                {column.tooltip && <p>{column.tooltip}</p>}
                <p>
                  {column.previousValue.toLocaleString("en-us", {
                    maximumFractionDigits: 0,
                    compactDisplay: "short",
                  })}{" "}
                  predictions
                </p>
              </TooltipContent>
            )}
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
