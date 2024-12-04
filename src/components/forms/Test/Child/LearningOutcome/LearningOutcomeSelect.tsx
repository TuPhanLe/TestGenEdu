import React from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

// Dữ liệu kết quả học tập
const LearningOutcomeEnumList = [
  { value: "PL01", label: "PL01 - Understanding Basic Concepts" },
  { value: "PL02", label: "PL02 - Application of Knowledge" },
  { value: "PL03", label: "PL03 - Analytical Thinking" },
  { value: "PL04", label: "PL04 - Critical Evaluation" },
  { value: "PL05", label: "PL05 - Communication Skills" },
  { value: "PL06", label: "PL06 - Research Methodology" },
  { value: "PL07", label: "PL07 - Practical Skills" },
  { value: "PL08", label: "PL08 - Collaboration and Teamwork" },
  { value: "PL09", label: "PL09 - Problem Solving" },
  { value: "PL10", label: "PL10 - Innovation and Creativity" },
];

const LearningOutcomeSelect = ({ form, partIndex, qIndex }: any) => {
  return (
    <FormField
      control={form.control}
      name={`parts.${partIndex}.questions.${qIndex}.outcome`} // Đảm bảo đường dẫn chính xác
      render={({ field }) => (
        <FormItem>
          <FormLabel>Learning Outcome</FormLabel>
          <FormControl>
            <Select
              {...field}
              value={field.value}
              onValueChange={field.onChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Learning Outcome" />
              </SelectTrigger>
              <SelectContent>
                {LearningOutcomeEnumList.map((outcome) => (
                  <SelectItem key={outcome.value} value={outcome.value}>
                    {outcome.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default LearningOutcomeSelect;
