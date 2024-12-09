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
const FillupQuestion = ({ form, partIndex, qIndex }: any) => {
  React.useEffect(() => {
    form.setValue(`parts.${partIndex}.questions.${qIndex}.options`, []);
  }, [form, partIndex, qIndex]);
  const outcomes = [
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
      {/* Trường cho đáp án đúng */}
      <LearningOutcomeSelect
        form={form}
        partIndex={partIndex}
        qIndex={qIndex}
      />{" "}
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
