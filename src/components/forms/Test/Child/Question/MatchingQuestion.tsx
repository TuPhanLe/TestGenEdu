import React from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useFieldArray } from "react-hook-form";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import LearningOutcomeSelect from "../LearningOutcome/LearningOutcomeSelect";

const MatchingQuestion = ({ form, partIndex, qIndex }: any) => {
  const LearningOutcomeEnum = [
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
  const {
    fields: optionFields,
    append: appendOption,
    remove: removeOption,
  } = useFieldArray({
    control: form.control,
    name: `parts.${partIndex}.questions.${qIndex}.options`,
  });
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
      {/* Câu hỏi chính của câu Matching */}
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
            <FormLabel>Matching Question</FormLabel>
            <FormControl>
              <Input placeholder="Enter the matching question..." {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      {/* Trường cho câu trả lời đúng */}
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
      {/* Hiển thị danh sách đáp án nhiễu */}
      {optionFields.map((option, optIndex) => (
        <FormField
          key={option.id} // Mỗi option phải có một key duy nhất
          control={form.control}
          name={`parts.${partIndex}.questions.${qIndex}.options.${optIndex}`}
          render={({ field }) => (
            <FormItem className="flex items-center space-x-2">
              <div className="flex-grow">
                <FormLabel>Distractor {optIndex + 1}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={`Enter distractor ${optIndex + 1}...`}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </div>
              <Button
                type="button"
                variant="destructive"
                onClick={() => removeOption(optIndex)} // Nút xóa đáp án nhiễu
                className="ml-auto h-full" // Sử dụng h-full để nút "Remove" có chiều cao bằng với input
              >
                Remove
              </Button>
            </FormItem>
          )}
        />
      ))}
    </>
  );
};

export default MatchingQuestion;
