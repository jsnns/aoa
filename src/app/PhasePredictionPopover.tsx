"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getPhaseBySupabaseId } from "@/data/phases";
import { useEffect, useState } from "react";
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

  const phase = getPhaseBySupabaseId(phaseId);
  if (!phase) {
    return <div>Phase not found</div>;
  }

  if (hasSubmitted) {
    return null;
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Make a Prediction</Button>
      </DialogTrigger>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>Predict arrival of {phase.title}</DialogTitle>
        </DialogHeader>
        <PhasePredictionForm
          submit={(a) => {
            submit({ ...a, phaseId });
            markSubmitted();
          }}
        />
      </DialogContent>
    </Dialog>
  );
};
