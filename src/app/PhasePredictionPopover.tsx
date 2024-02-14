"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useEffect, useState } from "react";
import { CheckCircle } from "react-feather";
import {
  PhasePredictionForm,
  PhasePredictionFormProps,
} from "./PhasePredictionForm";

interface Props {
  phaseId: number;
  submit: PhasePredictionFormProps["submit"];
}

export const PhasePredictionPopover: React.FC<Props> = ({
  submit,
  phaseId,
}) => {
  const [hasSubmitted, setHasSubmitted] = useState<boolean | null>(null);

  useEffect(() => {
    const submitted = localStorage.getItem(`phase-${phaseId}-submitted`);
    setHasSubmitted(submitted === "true");
  }, [phaseId]);

  const markSubmitted = () => {
    localStorage.setItem(`phase-${phaseId}-submitted`, "true");
    setHasSubmitted(true);
  };

  if (hasSubmitted === null) {
    return null;
  }

  if (hasSubmitted) {
    return (
      <div className="flex flex-row gap-2 opacity-50 cursor-not-allowed text-sm items-center">
        <CheckCircle size={17} />
        <span>Predicted</span>
      </div>
    );
  }

  return (
    <Popover modal>
      <PopoverTrigger asChild>
        <Button>Predict</Button>
      </PopoverTrigger>
      <PopoverContent className="" side="top" align="end" sideOffset={-40}>
        <PhasePredictionForm
          submit={(a) => {
            submit({ ...a, phaseId });
            markSubmitted();
          }}
        />
      </PopoverContent>
    </Popover>
  );
};
