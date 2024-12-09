import React, { useEffect } from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import LearningOutcomeSelect from "../LearningOutcome/LearningOutcomeSelect";

const RewriteQuestion = ({ form, partIndex, qIndex }: any) => {
  // Đặt options và paragraph mặc định khi component render
  React.useEffect(() => {
    form.setValue(`parts.${partIndex}.questions.${qIndex}.options`, []);
  }, [form, partIndex, qIndex]);
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
      {/* Trường nhập câu hỏi cần viết lại */}
      <LearningOutcomeSelect
        form={form}
        partIndex={partIndex}
        qIndex={qIndex}
      />{" "}
      <FormField
        control={form.control}
        name={`parts.${partIndex}.questions.${qIndex}.question`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Rewrite Question</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Enter the text to be rewritten..."
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      {/* Trường nhập Option (Hint) */}
      <FormField
        control={form.control}
        name={`parts.${partIndex}.questions.${qIndex}.options[0]`} // Truy cập vào phần tử đầu tiên của options
        render={({ field }) => (
          <FormItem>
            <FormLabel>Option / Hint (Optional)</FormLabel>
            <FormControl>
              <Input placeholder="Enter an option or hint..." {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      {/* Trường nhập câu trả lời đã viết lại */}
      <FormField
        control={form.control}
        name={`parts.${partIndex}.questions.${qIndex}.answer`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Rewritten Answer</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Enter the rewritten answer..."
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default RewriteQuestion;
