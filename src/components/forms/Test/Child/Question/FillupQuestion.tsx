import React from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const FillupQuestion = ({ form, partIndex, qIndex }: any) => {
  return (
    <>
      {/* Trường cho đáp án đúng */}
      <FormField
        control={form.control}
        name={`parts.${partIndex}.questions.${qIndex}.answer`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Correct Answer</FormLabel>
            <FormControl>
              <Input placeholder="Enter the correct answer..." {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Các lựa chọn (options) */}
      {Array(3)
        .fill("")
        .map((_, optIndex) => (
          <FormField
            key={optIndex}
            control={form.control}
            name={`parts.${partIndex}.questions.${qIndex}.options.${optIndex}`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Option {optIndex + 1}</FormLabel>
                <FormControl>
                  <Input placeholder={`Option ${optIndex + 1}`} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
    </>
  );
};

export default FillupQuestion;
