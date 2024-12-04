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
import LearningOutcomeSelect from "../LearningOutcome/LearningOutcomeSelect";
const MCQQuestion = ({ form, partIndex, qIndex }: any) => {
  const LearningOutcomeEnumList = [
    "PL01",
    "PL02",
    "PL03",
    "PL04",
    "PL05",
    "PL06",
    "PL07",
    "PL08",
    "PL09",
    "PL10",
  ];

  return (
    <>
      {/* Trường nhập câu hỏi */}
      <LearningOutcomeSelect
        form={form}
        partIndex={partIndex}
        qIndex={qIndex}
      />{" "}
      {/* Sử dụng phần cải tiến */}
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
