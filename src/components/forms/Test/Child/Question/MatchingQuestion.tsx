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

const MatchingQuestion = ({ form, partIndex, qIndex }: any) => {
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

  return (
    <>
      {/* Câu hỏi chính của câu Matching */}
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

      {/* Nút để thêm đáp án nhiễu */}
      <div className="flex justify-end mt-2">
        <Button
          type="button"
          onClick={() => appendOption({ value: "" })} // Thêm một option mới
          variant="outline"
        >
          Add Option
        </Button>
      </div>
    </>
  );
};

export default MatchingQuestion;
