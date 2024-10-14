import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useFieldArray, UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import Question from "./Question";
import cuid from "cuid";
import DropdownCRUD from "@/components/dropdownmenu/DropdownCRUD"; // Import DropdownCRUD

interface PartProps {
  part: any;
  index: number;
  form: UseFormReturn<any>;
  expandedparts: string[];
  toggleExpandpart: (partId: string) => void;
  expandedQuestions: string[];
  toggleExpandQuestions: (questionId: string) => void;
  removePart: () => void; // Hàm để xóa Part
}

const Part = ({
  part,
  index,
  form,
  expandedparts,
  toggleExpandpart,
  expandedQuestions,
  toggleExpandQuestions,
  removePart, // Nhận hàm remove từ CreateTest
}: PartProps) => {
  const {
    fields: questionFields,
    append: appendQuestion,
    remove: removeQuestion,
  } = useFieldArray({
    control: form.control,
    name: `parts.${index}.questions`,
  });

  const handleAddQuestion = () => {
    // Kiểm tra type mới nhất của part
    const currentType = form.watch(`parts.${index}.type`);

    switch (currentType) {
      case "true_false":
        appendQuestion({
          questionId: cuid(),
          question: "",
          answer: "",
          options: null, // Không cần options cho câu hỏi True/False
        });
        break;
      case "mcq":
      case "fillup":
      case "matching":
      case "rewrite":
        appendQuestion({
          questionId: cuid(),
          question: "",
          answer: "",
          options: ["", "", ""],
        });
        break;
      default:
        console.warn("Unknown question type");
    }
  };

  return (
    <Card key={part.partId} className="mb-4">
      <CardHeader className="flex ">
        <CardTitle className="text-2xl font-bold flex justify-between items-center">
          <span
            onClick={() => toggleExpandpart(part.partId)}
            className="cursor-pointer"
          >
            Part {index + 1}
          </span>
          <DropdownCRUD
            edit={() => toggleExpandpart(part.partId)}
            delete={removePart} // Xóa part
          />
        </CardTitle>
      </CardHeader>

      {expandedparts.includes(part.partId) && (
        <CardContent>
          <FormField
            control={form.control}
            name={`parts.${index}.type`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type of Questions</FormLabel>
                <Select
                  onValueChange={(value) =>
                    field.onChange(
                      value as
                        | "mcq"
                        | "true_false"
                        | "matching"
                        | "fillup"
                        | "rewrite"
                    )
                  }
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mcq">Multiple Choice</SelectItem>
                    <SelectItem value="true_false">True/False</SelectItem>
                    <SelectItem value="fillup">Fill Up</SelectItem>
                    <SelectItem value="matching">Matching</SelectItem>
                    <SelectItem value="rewrite">Rewrite</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Kiểm tra nếu type không phải là "rewrite", render trường Paragraph */}
          {form.watch(`parts.${index}.type`) !== "rewrite" && (
            <FormField
              control={form.control}
              name={`parts.${index}.part`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Paragraph</FormLabel>
                  <FormControl>
                    <Textarea
                      className="w-full h-48"
                      placeholder="Enter a paragraph ..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {questionFields.map((question, qIndex) => (
            <Question
              key={question.id}
              question={question}
              qIndex={qIndex}
              partIndex={index}
              form={form}
              expandedQuestions={expandedQuestions}
              toggleExpandQuestions={toggleExpandQuestions}
              type={form.watch(`parts.${index}.type`)}
              removeQuestion={() => removeQuestion(qIndex)} // Truyền hàm removeQuestion vào Question
            />
          ))}

          <div className="flex justify-end">
            <Button
              type="button"
              onClick={handleAddQuestion}
              variant="outline"
              size="sm"
            >
              Add Question
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default Part;
