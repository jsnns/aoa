"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { DateTime } from "luxon";
import { useForm } from "react-hook-form";
import { z } from "zod";

const predictionSchema = z.object({
  year: z.coerce.number().min(DateTime.now().year).max(2075),
  month: z.coerce.number().min(1).max(12).optional(),
});

export interface PhasePredictionFormProps {
  submit: (
    data: z.infer<typeof predictionSchema> & { phaseId: number }
  ) => void;
}

export const PhasePredictionForm: React.FC<PhasePredictionFormProps> = ({
  submit,
}) => {
  const form = useForm<z.infer<typeof predictionSchema>>({
    resolver: zodResolver(predictionSchema),
    defaultValues: {
      month: 12,
    },
  });

  const duration = DateTime.fromObject({
    year: form.getValues("year"),
    month: form.getValues("month"),
  }).diff(DateTime.now(), "months");

  return (
    <Form {...form}>
      <form
        // grabbing first argument from handleSubmit since submit is a server action and cannot take the form data parameters that follow
        onSubmit={form.handleSubmit((d) => submit({ ...d, phaseId: 0 }))}
        className="flex flex-col gap-4"
      >
        <FormField
          control={form.control}
          name="year"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Year</FormLabel>
              <FormControl>
                <Input autoFocus type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="month"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Month</FormLabel>
              <FormControl>
                <Select
                  {...field}
                  value={String(field.value)}
                  onValueChange={(v) =>
                    field.onChange(v === "" ? undefined : Number(v))
                  }
                >
                  <SelectTrigger>
                    <SelectValue>
                      {field.value
                        ? DateTime.local(2000, field.value).monthLong
                        : "Select a month"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 12 }).map((_, i) => (
                      <SelectItem key={i} value={String(i + 1)}>
                        {DateTime.local(2000, i + 1).monthLong}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="mt-8"
          disabled={!form.formState.isValid}
        >
          {!form.formState.isValid && "Submit Prediction"}
          {form.formState.isValid &&
            `Submit prediction for ${duration.toFormat("M")} months`}
        </Button>
      </form>
    </Form>
  );
};
