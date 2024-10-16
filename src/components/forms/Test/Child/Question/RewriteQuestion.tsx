import React from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const RewriteQuestion = ({ form, partIndex, qIndex }: any) => {
  // Sử dụng useEffect để đặt giá trị cho options khi component được render
  React.useEffect(() => {
    form.setValue(`parts.${partIndex}.questions.${qIndex}.options`, []);
    form.setValue(`parts.${partIndex}.paragraph`, "");
  }, [form, partIndex, qIndex]);

  return (
    <>
      {/* Trường nhập câu hỏi cần viết lại */}
      <FormField
        control={form.control}
        name={`parts.${partIndex}.questions.${qIndex}.question`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Rewrite Question</FormLabel>
            <FormControl>
              <Input
                placeholder="Enter the text to be rewritten..."
                {...field}
              />
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
              <Input placeholder="Enter the rewritten answer..." {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default RewriteQuestion;
