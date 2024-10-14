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
      topic: "Semester",
      testDuration: 60,
      attemptsAllowed: 1,
      parts: [
        {
          partId: cuid(),
          part: "In the heart of the Amazon rainforest...",
          type: "mcq",
          questions: [
            {
              questionId: cuid(),
              question: "What is the main focus of the text?",
              answer: "The biodiversity of the Amazon rainforest",
              options: [
                "The mysteries of the ocean",
                "The history of ancient civilizations",
                "The exploration of outer space",
              ],
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

  // const { mutate: createTest } = useMutation({
  //   mutationFn: async (input: any) => {
  //     try {
  //       const response = await axios.post("/api/test/create", input);
  //       return response.data;
  //     } catch (error) {
  //       console.error("Error:", error);
  //       throw error;
  //     }
  //   },
  // });

  const onSubmit = (data: any) => {
    console.log(data);

    // createTest(data);
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
                removePart={() => remove(index)} // Truyền hàm remove vào Part
              />
            ))}

            <Button type="submit" className="w-full">
              Submit
            </Button>
          </form>
          <div className="fixed top-[20%] right-20 p-4">
            <FamilyPopoverMenu
              add={() =>
                append({
                  partId: cuid(),
                  part: "",
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
