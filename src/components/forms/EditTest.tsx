"use client";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useFieldArray, useForm } from "react-hook-form";
import { testSchema } from "@/schemas/form/test";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  Form,
  FormField,
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Textarea } from "../ui/textarea";
import { Paragraph, Question, Test } from "@prisma/client";
import cuid from "cuid";
import { Separator } from "../ui/separator";

import FamilyPopoverMenu from "../ui/familypopovermenu";
import DropdownCRUD from "../dropdownmenu/DropdownCRUD";
import { ResponsiveDialog } from "../forms/responsive-dialog";
import { CopyClipboard } from "../ui/copy-clipboard";

type Props = {
  test: Test & {
    paragraphs: (Pick<Paragraph, "id" | "content"> & {
      questions: Pick<Question, "id" | "question" | "options" | "answer">[];
    })[];
  };
};

type Input = z.infer<typeof testSchema>;

const EditTest = ({ test }: Props) => {
  const router = useRouter();
  const [addQuestionBut, setAddQuestionBut] = useState<boolean>(false);
  const [isShareLinkOpen, setIsShareLinkOpen] = useState(false);

  const { mutate: updateTest } = useMutation({
    mutationFn: async ({ testId, topic, type, paragraphs }: Input) => {
      try {
        const response = await axios.put("/api/test/update", {
          testId,
          topic,
          type,
          paragraphs,
        });
        return response.data;
      } catch (error) {
        console.error("Error in mutation:", error);
        throw error;
      }
    },
  });

  const form = useForm<Input>({
    resolver: zodResolver(testSchema),
    defaultValues: {
      testId: test.id,
      topic: test.topic,
      type: test.testType,
      paragraphs: test.paragraphs.map((p) => ({
        paragraph: p.content,
        paragraphId: p.id,
        questions: p.questions.map((q) => ({
          questionId: q.id,
          question: q.question,
          answer: q.answer,
          options: JSON.parse(q.options as string).filter(
            (option: string) => option !== q.answer
          ),
        })),
      })),
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "paragraphs",
  });

  const [expandedParagraphs, setExpandedParagraphs] = useState<string[]>([]);
  const [expandedQuestions, setExpandedQuestions] = useState<string[]>([]);

  const toggleExpandParagraph = (paragraphId: string) => {
    setExpandedParagraphs((prev) =>
      prev.includes(paragraphId)
        ? prev.filter((id) => id !== paragraphId)
        : [...prev, paragraphId]
    );
  };
  const toggleExpandQuestions = (questionId: string) => {
    setExpandedQuestions((prev) =>
      prev.includes(questionId)
        ? prev.filter((id) => id !== questionId)
        : [...prev, questionId]
    );
  };
  const handleAddQuestion = (index: number) => {
    const currentQuestions = form.getValues(`paragraphs.${index}.questions`);
    form.setValue(`paragraphs.${index}.questions`, [
      ...currentQuestions,
      { questionId: cuid(), question: "", answer: "", options: ["", "", ""] },
    ]);
    setAddQuestionBut((prevState) => !prevState);
  };

  const handleRemoveQuestion = (paraIndex: number, qIndex: number) => {
    const currentQuestions = form.getValues(
      `paragraphs.${paraIndex}.questions`
    );
    if (currentQuestions.length > 1) {
      form.setValue(
        `paragraphs.${paraIndex}.questions`,
        currentQuestions.filter((_, i) => i !== qIndex)
      );
      setAddQuestionBut((prevState) => !prevState);
    } else {
      alert("You must have at least 1 question");
    }
  };
  const handleAddParagraph = () => {
    const newParagraph = {
      paragraphId: cuid(),
      paragraph: "",
      questions: [
        {
          questionId: cuid(),
          question: "",
          answer: "",
          options: ["", "", ""],
        },
      ],
    };
    append(newParagraph);
    setExpandedParagraphs((prev) => [...prev, newParagraph.paragraphId]);
  };
  const handleRemoveParagraph = (index: number) => {
    if (fields.length > 1) {
      remove(index); // Remove the paragraph at the given index
      setExpandedParagraphs((prev) =>
        prev.filter((id) => id !== fields[index].paragraphId)
      );
    } else {
      alert("You must have at least 1 paragraph");
    }
  };

  const onSubmit = (data: Input) => {
    updateTest(data, {
      onSuccess: ({ gameId }) => {
        setIsShareLinkOpen(true);
      },
      onError: (error) => {
        console.error("Submit error:", error);
      },
    });
  };

  return (
    <div className="relative flex justify-center ">
      <div className="w-1/2 mt-2">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold tracking-tight">
              Edit Test!
            </h2>
            <p className="text-sm text-muted-foreground">Modify your test.</p>
          </div>
        </div>
        <Separator className="my-4" />
        <ResponsiveDialog
          isOpen={isShareLinkOpen}
          setIsOpen={setIsShareLinkOpen}
          title="Share your test"
        >
          <h3>localhost:3000/stu/play/{test.id}</h3>
          <CopyClipboard textToCopy={`localhost:3000/stu/play/${test.id}`} />
        </ResponsiveDialog>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="topic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Topic</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter a topic ..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {fields.map((item, index) => (
              <Card key={item.paragraphId} className="mb-4">
                <CardHeader className="flex ">
                  <CardTitle className="text-2xl font-bold flex justify-between items-center">
                    {/* Clickable Part Text */}
                    <span
                      onClick={() => toggleExpandParagraph(item.paragraphId)}
                      className="cursor-pointer"
                    >
                      Part {index + 1}
                    </span>

                    {/* Dropdown Menu */}
                    <DropdownCRUD
                      edit={() => toggleExpandParagraph(item.paragraphId)}
                      delete={() => handleRemoveParagraph(index)}
                    />
                  </CardTitle>
                </CardHeader>
                {expandedParagraphs.includes(item.paragraphId) && (
                  <CardContent>
                    <FormField
                      control={form.control}
                      name={`paragraphs.${index}.paragraph`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Textarea
                              className="w-full h-48"
                              placeholder="Enter a paragraph ..."
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Please provide a paragraph.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {form
                      .getValues(`paragraphs.${index}.questions`)
                      .map((question, qIndex) => (
                        <Card
                          key={question.questionId}
                          className="mt-6 p-1 m-4"
                        >
                          <CardHeader>
                            <CardTitle className="text-xl font-bold">
                              <div className="flex justify-between items-center cursor-pointer">
                                <span
                                  className="cursor-pointer"
                                  onClick={() =>
                                    toggleExpandQuestions(question.questionId)
                                  }
                                >
                                  Question {qIndex + 1}
                                </span>
                                <DropdownCRUD
                                  edit={() =>
                                    toggleExpandQuestions(question.questionId)
                                  }
                                  delete={() =>
                                    handleRemoveQuestion(index, qIndex)
                                  }
                                />
                              </div>
                            </CardTitle>
                          </CardHeader>
                          {expandedQuestions.includes(question.questionId) && (
                            <CardContent>
                              <FormField
                                control={form.control}
                                name={`paragraphs.${index}.questions.${qIndex}.question`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Question</FormLabel>
                                    <FormControl>
                                      <Input
                                        placeholder="Enter question ..."
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name={`paragraphs.${index}.questions.${qIndex}.answer`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Answer</FormLabel>
                                    <FormControl>
                                      <Input
                                        placeholder="Enter the answer ..."
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              {question.options.map((option, optIndex) => (
                                <FormField
                                  key={optIndex}
                                  control={form.control}
                                  name={`paragraphs.${index}.questions.${qIndex}.options.${optIndex}`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>
                                        Option {optIndex + 1}
                                      </FormLabel>
                                      <FormControl>
                                        <Input
                                          placeholder={`Option ${
                                            optIndex + 1
                                          } ...`}
                                          {...field}
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              ))}
                              <div className="flex justify-end">
                                <Button
                                  type="button"
                                  onClick={() =>
                                    form.setValue(
                                      `paragraphs.${index}.questions.${qIndex}.options`,
                                      [...question.options, ""]
                                    )
                                  }
                                  variant="outline"
                                  size="sm"
                                  className="mt-2"
                                >
                                  Add Option
                                </Button>
                              </div>
                            </CardContent>
                          )}
                        </Card>
                      ))}
                    <div className="flex justify-end">
                      <Button
                        type="button"
                        onClick={() => handleAddQuestion(index)}
                        variant="outline"
                        size="sm"
                      >
                        {" "}
                        Add Question{" "}
                      </Button>{" "}
                    </div>
                  </CardContent>
                )}{" "}
              </Card>
            ))}

            <Button type="submit" className="w-full">
              Save Changes
            </Button>
          </form>
        </Form>
      </div>
      <div className="fixed top-[20%] right-20 p-4">
        <FamilyPopoverMenu
          add={handleAddParagraph}
          share={() => {
            setIsShareLinkOpen(true);
          }}
        />
      </div>
    </div>
  );
};

export default EditTest;
