"use client";
import React, { useState } from "react";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { testSchema } from "@/schemas/form/test";
import cuid from "cuid";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import Part from "./Child/Part";
import TestHeader from "./Child/TestHeader";
import { Button } from "@/components/ui/button";
import FamilyPopoverMenu from "@/components/ui/familypopovermenu";

const CreateTest = ({ folderId }: { folderId?: string }) => {
  const [expandedparts, setExpandedparts] = useState<string[]>([]);
  const [expandedQuestions, setExpandedQuestions] = useState<string[]>([]);
  const [isShareLinkOpen, setIsShareLinkOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(testSchema),
    defaultValues: {
      testId: cuid(),
      topic: "Semester Test",
      testDuration: 60,
      attemptsAllowed: 1,
      parts: [
        // Multiple Choice Question (MCQ)
        {
          partId: cuid(),
          paragraph: "In the heart of the Amazon rainforest...",
          type: "mcq",
          questions: [
            {
              outcome: "PL07",
              questionId: cuid(),
              question: " question",
              answer: "The biodiversity of the Amazon rainforest",
              options: [
                "The mysteries of the ocean",
                "The history of ancient civilizations",
                "The exploration of outer space",
              ],
            },
          ],
        },
        // True/False Question
        {
          partId: cuid(),
          paragraph: "In the heart of the Amazon rainforest...",
          type: "true_false",
          questions: [
            {
              outcome: "PL01",
              questionId: cuid(),
              question: " question",
              answer: "false",
              options: [], // Không cần options cho câu hỏi True/False
            },
          ],
        },
        // Matching Question
        {
          partId: cuid(),
          paragraph: "Match the animals to their correct habitat.",
          type: "matching",
          questions: [
            {
              outcome: "PL01",
              questionId: cuid(),
              question: " question",
              answer: "Jaguar, Sloth, Macaw",
              options: ["Polar bear", "Penguin", "Camel"], // Distractors
            },
          ],
        },
        // Fill in the Blanks Question (Không có question, chỉ có answer và options)
        {
          partId: cuid(),
          paragraph:
            "The [_____] rainforest is the largest [_____] on Earth and plays a critical role in [_____].", // Đoạn văn có 3 lỗ trống
          type: "fillup",
          questions: [
            {
              outcome: "PL01",
              questionId: cuid(), // Lỗ trống đầu tiên
              answer: "Amazon", // Đáp án cho lỗ trống đầu tiên
              options: ["Savanna", "Desert", "Sahara"], // Các lựa chọn không bao gồm đáp án đúng
            },
            {
              outcome: "PL01",
              questionId: cuid(), // Lỗ trống thứ hai
              answer: "forest", // Đáp án cho lỗ trống thứ hai
              options: ["ocean", "grassland", "Sahara"], // Các lựa chọn không bao gồm đáp án đúng
            },
            {
              outcome: "PL01",
              questionId: cuid(), // Lỗ trống thứ ba
              answer: "climate regulation", // Đáp án cho lỗ trống thứ ba
              options: ["carbon storage", "water cycle", "Sahara"], // Các lựa chọn không bao gồm đáp án đúng
            },
          ],
        },
        // Rewrite Question
        {
          partId: cuid(),
          paragraph: "", // No paragraph for rewrite type
          type: "rewrite",
          questions: [
            {
              outcome: "PL01",
              question: " question",
              questionId: cuid(),
              answer: "The rainforest in the Amazon covers a large area.",
              options: [], // No options for rewrite questions
            },
          ],
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "parts",
  });

  const { mutate: createTest, isPending } = useMutation({
    mutationFn: async (input: any) => {
      const response = await axios.post("/api/test/create", input);
      return response.data;
    },
    onSuccess: () => {
      alert("Test created successfully!");
      form.reset(); // Reset the form on success
    },
    onError: (error) => {
      console.error("Error:", error);
      alert("Failed to create the test. Please try again.");
    },
  });

  const onSubmit = (data: any) => {
    createTest(data);
  };

  return (
    <div className="relative flex justify-center">
      <div className="w-1/2 mt-2">
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <TestHeader form={form} />
            {fields.map((part, index) => (
              <Part
                key={part.partId}
                part={part}
                index={index}
                form={form}
                expandedparts={expandedparts}
                toggleExpandpart={(partId: string) =>
                  setExpandedparts((prev) =>
                    prev.includes(partId)
                      ? prev.filter((id) => id !== partId)
                      : [...prev, partId]
                  )
                }
                expandedQuestions={expandedQuestions}
                toggleExpandQuestions={(questionId: string) =>
                  setExpandedQuestions((prev) =>
                    prev.includes(questionId)
                      ? prev.filter((id) => id !== questionId)
                      : [...prev, questionId]
                  )
                }
                removePart={() => remove(index)}
              />
            ))}

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Submitting..." : "Submit"}
            </Button>
          </form>
          <div className="fixed top-[20%] right-20 p-4">
            <FamilyPopoverMenu
              add={() =>
                append({
                  partId: cuid(),
                  paragraph: "",
                  type: "matching",
                  questions: [],
                })
              }
              share={() => setIsShareLinkOpen(true)}
            />
          </div>
        </FormProvider>
      </div>
    </div>
  );
};

export default CreateTest;
