import React from "react";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const TestHeader = ({ form }: { form: any }) => (
  <>
    <FormField
      control={form.control}
      name="topic"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Topic</FormLabel>
          <FormControl>
            <Input placeholder="Enter a topic ..." {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
    <FormField
      control={form.control}
      name="testDuration"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Test Duration (minutes)</FormLabel>
          <FormControl>
            <Input type="number" placeholder="Enter duration ..." {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
    <FormField
      control={form.control}
      name="attemptsAllowed"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Attempt Allowed (time)</FormLabel>
          <FormControl>
            <Input
              type="number"
              placeholder="Enter the number of attempts ..."
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  </>
);

export default TestHeader;
