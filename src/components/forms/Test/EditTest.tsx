"use client";
import React, { useState } from "react";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { testSchema, TestSchemaType } from "@/schemas/form/test";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import Part from "./Child/Part";
import TestHeader from "./Child/TestHeader";
import { Button } from "@/components/ui/button";
import FamilyPopoverMenu from "@/components/ui/familypopovermenu";
import cuid from "cuid";

type EditTestProps = {
  test: TestSchemaType;
};

const EditTest: React.FC<EditTestProps> = ({ test }) => {
  const [expandedparts, setExpandedparts] = useState<string[]>([]);
  const [expandedQuestions, setExpandedQuestions] = useState<string[]>([]);
  const [isShareLinkOpen, setIsShareLinkOpen] = useState(false);

  console.log("Loaded Test Data:", test);

  const form = useForm<TestSchemaType>({
    resolver: zodResolver(testSchema),
    defaultValues: test,
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "parts",
  });

  const {
    mutate: updateTest,
    isPending,
    isSuccess,
    isError,
  } = useMutation({
    mutationFn: async (input: TestSchemaType) => {
      try {
        console.log("Sending Update Request:", input);
        const response = await axios.put(`/api/test/update`, input);
        console.log("Update Response:", response.data);
        return response.data;
      } catch (error) {
        console.error("Error updating test:", error);
        throw error;
      }
    },
    onSuccess: () => {
      alert("Test updated successfully!");
    },
    onError: (error) => {
      console.error("Update failed:", error);
      alert("Failed to update the test. Please try again.");
    },
  });

  const onSubmit = (data: TestSchemaType) => {
    console.log("Form Submitted with Data:", data);
    updateTest(data);
  };

  return (
    <div className="relative flex justify-center">
      <div className="w-1/2 mt-2">
        <FormProvider {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, (errors) =>
              console.log("Form Errors:", errors)
            )}
            className="space-y-8"
          >
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
              {isPending ? "Saving..." : "Save Changes"}
            </Button>
          </form>

          <div className="fixed top-[20%] right-20 p-4">
            <FamilyPopoverMenu
              add={() =>
                append({
                  partId: cuid(),
                  paragraph: "",
                  type: "mcq",
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

export default EditTest;
