import React from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

const TrueFalseQuestion = ({ form, partIndex, qIndex }: any) => {
  // Ensure options are set to an empty array for True/False questions
  React.useEffect(() => {
    form.setValue(`parts.${partIndex}.questions.${qIndex}.options`, []);
  }, [form, partIndex, qIndex]);

  return (
    <>
      {/* Question Field */}
      <FormField
        control={form.control}
        name={`parts.${partIndex}.questions.${qIndex}.question`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Question</FormLabel>
            <FormControl>
              <Input
                placeholder="Enter the true/false question..."
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Answer Field (True/False Select) */}
      <FormField
        control={form.control}
        name={`parts.${partIndex}.questions.${qIndex}.answer`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Answer (True/False)</FormLabel>
            <FormControl>
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                  // Ensure options are always set to an empty array for True/False questions
                  form.setValue(
                    `parts.${partIndex}.questions.${qIndex}.options`,
                    []
                  );
                }}
                defaultValue={field.value || "true"} // Default to "True" if no value is set
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select True or False" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">True</SelectItem>
                  <SelectItem value="false">False</SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default TrueFalseQuestion;
