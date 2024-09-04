"use client";
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useFieldArray, useForm, Controller } from "react-hook-form";
import { testSchema } from "@/schemas/form/test";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Trash, Plus, ChevronDown, ChevronUp } from "lucide-react";
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
import cuid from "cuid";
import DropdownCRUD from "../dropdownmenu/DropdownCRUD";
import { Separator } from "../ui/separator";
import FamilyPopoverMenu from "../ui/familypopovermenu";
import { ResponsiveDialog } from "../forms/responsive-dialog";
import { CopyClipboard } from "../ui/copy-clipboard";

type Props = {};

type Input = z.infer<typeof testSchema>;

const CreateTest = (props: Props) => {
  const router = useRouter();
  const [addQuestionBut, setAddQuestionBut] = useState<boolean>(false);
  const [isShareLinkOpen, setIsShareLinkOpen] = useState(false);

  const { mutate: createTest } = useMutation({
    mutationFn: async ({ testId, topic, type, paragraphs }: Input) => {
      try {
        const response = await axios.post("/api/test/create", {
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
      testId: cuid(),
      topic: "Semester",
      type: "mcq",
      paragraphs: [
        {
          paragraphId: cuid(),
          paragraph:
            "In the heart of the Amazon rainforest lies a realm teeming with life and mystery. Towering trees stretch towards the sky, forming a lush canopy that shelters a diverse array of flora and fauna. Among the foliage, vibrant birds flit about, their colorful plumage a testament to nature's artistry. Beneath the dense undergrowth, elusive creatures like jaguars and sloths navigate their verdant domain with silent grace. Yet, this vibrant ecosystem faces threats from deforestation and human encroachment. Conservation efforts strive to protect this invaluable treasure trove of biodiversity.",
          questions: [
            {
              questionId: cuid(),
              question: "What is the main focus of the text?",
              answer: "The biodiversity of the Amazon rainforest",
              options: [
                "The mysteries of the ocen",
                "The history of acient civilizations",
                "The exploration of outer space",
              ],
            },
            {
              questionId: cuid(),
              question:
                "Which of the following is mentioned as a threat to the Amazon rainforest?",
              answer: "Pollution from factories",
              options: [
                "Snowstorms",
                "Conservation efforts",
                "Argicultural expansion",
              ],
            },
          ],
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "paragraphs",
  });
  const testId = form.watch("testId");

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

  useEffect(() => {
    // Add effect to handle changes or cleanup if needed
  }, [addQuestionBut]);

  const onSubmit = (data: Input) => {
    createTest(data, {
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
              Create your test
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
          localhost:3000/stu/play/{testId}
          <CopyClipboard textToCopy={`localhost:3000/stu/play/${testId}`} />
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
              Submit
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

export default CreateTest;
