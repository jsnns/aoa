"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const predictionSchema = z.object({
  year: z.coerce.number(),
  month: z.coerce.number().optional(),
});

export interface PhasePredictionFormProps {
  submit: (data: z.infer<typeof predictionSchema>) => void;
}

export const PhasePredictionForm: React.FC<PhasePredictionFormProps> = ({
  submit,
}) => {
  const form = useForm<z.infer<typeof predictionSchema>>({
    resolver: zodResolver(predictionSchema),
    defaultValues: {},
  });

  return (
    <Form {...form}>
      <form
        // grabbing first argument from handleSubmit since submit is a server action and cannot take the form data parameters that follow
        onSubmit={form.handleSubmit((d) => submit(d))}
        className="space-y-8"
      >
        <FormField
          control={form.control}
          name="year"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Year</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormDescription>
                The year you predict this phase will arrive
              </FormDescription>
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
                <Input type="number" {...field} />
              </FormControl>
              <FormDescription>
                The month you predict this phase will arrive
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};
