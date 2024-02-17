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
  const ballSize = 18;
  const ballSpacing = 3;
  const maxBallsPerColumn = Math.floor(
    (height || 0) / (ballSize + ballSpacing)
  );
  const maxColumns = Math.floor((width || 0) / (ballSize + ballSpacing));

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

  const emptyColumns = maxColumns - columns.length;
  if (emptyColumns > 0) {
    for (let i = 0; i < emptyColumns; i++) {
      columns.push({ columnTitle: "", value: 0 });
    }
  }

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
                {column.annotate && (
                  // flag
                  <div
                    className="absolute top-0 bottom-0 bg-white annotation-enter"
                    style={{
                      width: ballSize + ballSpacing,
                      animationDelay: `${maxAnimationDelay + 500}ms`,
                    }}
                  >
                    <p className="text-[9px] rotate-90 pl-3 uppercase opacity-70 font-semibold">
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
                    className="opacity-10 bg-foreground"
                  />
                )}
              </div>
            </TooltipTrigger>

            {column.columnTitle && (
              <TooltipContent>
                <p className="font-semibold">{column.columnTitle}</p>
                {column.tooltip && <p>{column.tooltip}</p>}
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
