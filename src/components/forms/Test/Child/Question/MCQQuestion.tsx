import React from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const MCQQuestion = ({ form, partIndex, qIndex }: any) => {
  return (
    <>
      {/* Trường nhập câu hỏi */}
      <FormField
        control={form.control}
        name={`parts.${partIndex}.questions.${qIndex}.question`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Question</FormLabel>
            <FormControl>
              <Input placeholder="Enter the question..." {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
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
      {/* Các trường nhập các đáp án (Option 1, Option 2, Option 3, ...) */}
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

      {/* Trường nhập câu trả lời đúng */}
    </>
  );
};

export default MCQQuestion;
