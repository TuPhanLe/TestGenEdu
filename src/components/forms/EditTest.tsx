"use client";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useFieldArray, useForm } from "react-hook-form";
import { quizUpdateSchema } from "@/schemas/form/quiz";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Trash, ChevronDown, ChevronUp } from "lucide-react";
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
import LoadingQuestion from "../LoadingQuestion";
import { Textarea } from "../ui/textarea";
import { Paragraph, Question, Test } from "@prisma/client";
import cuid from "cuid";

type Props = {
  test: Test & {
    paragraphs: (Pick<Paragraph, "id" | "content"> & {
      questions: Pick<Question, "id" | "question" | "options" | "answer">[];
    })[];
  };
};

type Input = z.infer<typeof quizUpdateSchema>;

const EditTest = ({ test }: Props) => {
  const router = useRouter();
  const [showLoader, setShowLoader] = React.useState(false);
  const [finished, setFinished] = React.useState(false);
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
    resolver: zodResolver(quizUpdateSchema),
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
          options: JSON.parse(q.options as string),
        })),
      })),
    },
  });

  const { fields, append } = useFieldArray({
    control: form.control,
    name: "paragraphs",
  });

  const [expandedParagraphs, setExpandedParagraphs] = useState<string[]>([]);

  const toggleExpandParagraph = (paragraphId: string) => {
    setExpandedParagraphs((prev) =>
      prev.includes(paragraphId)
        ? prev.filter((id) => id !== paragraphId)
        : [...prev, paragraphId]
    );
  };

  const handleAddQuestion = (paragraphIndex: number) => {
    const currentQuestions = form.getValues(
      `paragraphs.${paragraphIndex}.questions`
    );
    form.setValue(`paragraphs.${paragraphIndex}.questions`, [
      ...currentQuestions,
      {
        questionId: cuid(),
        question: "",
        answer: "",
        options: ["", "", ""],
      },
    ]);
  };

  const handleRemoveQuestion = (
    paragraphIndex: number,
    questionIndex: number
  ) => {
    const currentQuestions = form.getValues(
      `paragraphs.${paragraphIndex}.questions`
    );
    if (currentQuestions.length > 1) {
      form.setValue(
        `paragraphs.${paragraphIndex}.questions`,
        currentQuestions.filter((_, i) => i !== questionIndex)
      );
    } else {
      alert("You must have at least 1 question");
    }
  };

  const onSubmit = (data: Input) => {
    console.log("Submitting data:", data); // Debugging line
    setShowLoader(true);
    updateTest(data, {
      onSuccess: ({ gameId }) => {
        setFinished(true);
        // Optionally navigate to another page
        // router.push(`/stu/play/mcq/${gameId}`);
      },
      onError: (error) => {
        console.error("Submit error:", error); // Debugging line
        setShowLoader(false);
      },
    });
  };

  if (showLoader) {
    return <LoadingQuestion finished={finished} />;
  }

  return (
    <div className="relative flex justify-center">
      <div className="w-1/2">
        <Card className="w-[1000px]">
          <CardHeader>
            <CardTitle className="text-3xl font-bold">
              Edit your test!
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
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
                    <CardHeader className="flex justify-between items-center">
                      <CardTitle className="text-2xl font-bold">
                        <Button
                          type="button"
                          onClick={() =>
                            toggleExpandParagraph(item.paragraphId)
                          }
                          className="ml-auto"
                          size="lg"
                        >
                          {expandedParagraphs.includes(item.paragraphId) ? (
                            <ChevronUp size={16} />
                          ) : (
                            <ChevronDown size={16} />
                          )}
                          Paragraph {item.paragraphId}
                        </Button>
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
                                  Question {question.questionId}
                                </CardTitle>
                                <Button
                                  type="button"
                                  onClick={() =>
                                    handleRemoveQuestion(index, qIndex)
                                  }
                                  variant="outline"
                                  size="sm"
                                  className="ml-auto"
                                >
                                  <Trash size={16} />
                                </Button>
                              </CardHeader>
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
                              </CardContent>
                            </Card>
                          ))}
                        <Button
                          type="button"
                          onClick={() => handleAddQuestion(index)}
                          variant="outline"
                          className="mt-4"
                        >
                          Add Question
                        </Button>
                      </CardContent>
                    )}
                  </Card>
                ))}

                <div className="flex justify-end gap-x-4">
                  <Button
                    type="button"
                    onClick={() =>
                      append({
                        paragraph: "",
                        questions: [],
                        paragraphId: cuid(),
                      })
                    }
                    variant="outline"
                  >
                    Add Paragraph
                  </Button>
                  <Button type="submit" className="bg-blue-500 text-white">
                    Submit
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditTest;
