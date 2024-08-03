"use client";
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useFieldArray, useForm, Controller } from "react-hook-form";
import { quizCreationSchema } from "@/schemas/form/quiz";
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

type Props = {};

type Input = z.infer<typeof quizCreationSchema>;

const QuizCreation = (props: Props) => {
  const router = useRouter();
  const [addQuestionBut, setAddQuestionBut] = useState<boolean>(false);
  const { mutate: getQuestions } = useMutation({
    mutationFn: async ({ topic, type, paragraphs }: Input) => {
      const response = await axios.post("/api/game", {
        topic,
        type,
        paragraphs,
      });
      return response.data;
    },
  });

  const form = useForm<Input>({
    resolver: zodResolver(quizCreationSchema),
    defaultValues: {
      topic: "Semester",
      type: "mcq",
      paragraphs: [
        {
          paragraph:
            "In the heart of the Amazon rainforest lies a realm teeming with life and mystery. Towering trees stretch towards the sky, forming a lush canopy that shelters a diverse array of flora and fauna. Among the foliage, vibrant birds flit about, their colorful plumage a testament to nature's artistry. Beneath the dense undergrowth, elusive creatures like jaguars and sloths navigate their verdant domain with silent grace. Yet, this vibrant ecosystem faces threats from deforestation and human encroachment. Conservation efforts strive to protect this invaluable treasure trove of biodiversity.",
          questions: [
            {
              question: "What is the main focus of the text?",
              answer: "The biodiversity of the Amazon rainforest",
              options: [
                "The mysteries of the ocen",
                "The history of acient civilizations",
                "The exploration of outer space",
              ],
            },
            {
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
        {
          paragraph:
            "In the heart of the Amazon rainforest lies a realm teeming with life and mystery. Towering trees stretch towards the sky, forming a lush canopy that shelters a diverse array of flora and fauna. Among the foliage, vibrant birds flit about, their colorful plumage a testament to nature's artistry. Beneath the dense undergrowth, elusive creatures like jaguars and sloths navigate their verdant domain with silent grace. Yet, this vibrant ecosystem faces threats from deforestation and human encroachment. Conservation efforts strive to protect this invaluable treasure trove of biodiversity.",
          questions: [
            {
              question: "What is the main focus of the text?",
              answer: "The biodiversity of the Amazon rainforest",
              options: [
                "The mysteries of the ocen",
                "The history of acient civilizations",
                "The exploration of outer space",
              ],
            },
            {
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

  const [expandedParagraphs, setExpandedParagraphs] = useState<number[]>([]);

  const toggleExpandParagraph = (index: number) => {
    setExpandedParagraphs((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handleAddQuestion = (index: number) => {
    const currentQuestions = form.getValues(`paragraphs.${index}.questions`);
    form.setValue(`paragraphs.${index}.questions`, [
      ...currentQuestions,
      { question: "", answer: "", options: ["", "", "", ""] },
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
    } else {
      alert("You must have at least 1 question");
    }
  };

  useEffect(() => {
    // Add effect to handle changes or cleanup if needed
  }, [addQuestionBut]);

  function onSubmit(data: Input) {
    getQuestions(data, {
      onSuccess: ({ gameId }) => {
        if (form.getValues("type") === "mcq") {
          router.push(`/play/mcq/${gameId}`);
        }
      },
    });
  }

  return (
    <div className="relative flex justify-center">
      <div className="w-1/2">
        <Card className="w-[1000px]">
          <CardHeader>
            <CardTitle className="text-3xl font-bold">Test Creation</CardTitle>
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
                {fields.map((item, indexPara) => (
                  <Card key={item.id} className="mb-4">
                    <CardHeader className="flex justify-between items-center">
                      <CardTitle className="text-2xl font-bold">
                        Paragraph {indexPara + 1}
                      </CardTitle>
                      <Button
                        type="button"
                        onClick={() => toggleExpandParagraph(indexPara)}
                        className="ml-auto"
                      >
                        {expandedParagraphs.includes(indexPara) ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </Button>
                    </CardHeader>
                    {expandedParagraphs.includes(indexPara) && (
                      <CardContent>
                        <FormField
                          control={form.control}
                          name={`paragraphs.${indexPara}.paragraph`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
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
                          .getValues(`paragraphs.${indexPara}.questions`)
                          .map((question, qIndex) => (
                            <Card key={qIndex} className="mt-6 p-1 m-4">
                              <CardHeader>
                                <CardTitle className="text-1xl font-bold">
                                  Question {qIndex + 1}
                                </CardTitle>
                              </CardHeader>
                              <CardContent className="relative">
                                <FormField
                                  control={form.control}
                                  name={`paragraphs.${indexPara}.questions.${qIndex}.question`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormControl>
                                        <Input
                                          className="w-full"
                                          placeholder="Enter a question ..."
                                          {...field}
                                        />
                                      </FormControl>
                                      <FormDescription>
                                        Please provide a question.
                                      </FormDescription>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={form.control}
                                  name={`paragraphs.${indexPara}.questions.${qIndex}.answer`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Answer</FormLabel>
                                      <FormControl>
                                        <Input
                                          className="w-full"
                                          placeholder="Enter an answer ..."
                                          {...field}
                                        />
                                      </FormControl>
                                      <FormDescription>
                                        Please provide an answer.
                                      </FormDescription>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                {form.getValues("type") === "mcq" && (
                                  <>
                                    {form
                                      .getValues(
                                        `paragraphs.${indexPara}.questions.${qIndex}.options`
                                      )
                                      .map((_, optIndex) => (
                                        <div
                                          key={optIndex}
                                          className="flex items-center w-full"
                                        >
                                          <FormField
                                            control={form.control}
                                            name={`paragraphs.${indexPara}.questions.${qIndex}.options.${optIndex}`}
                                            render={({ field }) => (
                                              <FormItem className="flex-grow">
                                                <FormLabel>
                                                  Option {optIndex + 1}
                                                </FormLabel>
                                                <FormControl>
                                                  <Input
                                                    className="w-full"
                                                    placeholder="Enter an option ..."
                                                    {...field}
                                                  />
                                                </FormControl>
                                                <FormDescription>
                                                  Please provide an option.
                                                </FormDescription>
                                                <FormMessage />
                                              </FormItem>
                                            )}
                                          />
                                        </div>
                                      ))}
                                  </>
                                )}
                                <div className="absolute -top-20 -right-20 transform -translate-x-1/2 flex flex-col bg-white border border-gray-300 rounded-lg shadow-lg p-2 z-50">
                                  <Button
                                    className="block bg-none border-none my-2"
                                    onClick={() =>
                                      handleRemoveQuestion(indexPara, qIndex)
                                    }
                                  >
                                    <Trash className="w-4 h-4" />
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        <Button
                          type="button"
                          onClick={() => handleAddQuestion(indexPara)}
                          className="mt-4"
                        >
                          Add Question
                        </Button>
                      </CardContent>
                    )}
                  </Card>
                ))}

                <Button type="submit" className="mt-4">
                  Submit
                </Button>
              </form>
            </Form>
            <Button
              onClick={() =>
                append({
                  paragraph: "alslaaaaaaaaaaaaaaaassaaaaaaaaaaaaaaaaaaaaaaaaaa",
                  questions: [
                    {
                      question:
                        "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb1",
                      answer:
                        "cccccccccccccccccccccccccccccccccccccccccccccccccccccccc",
                      options: [
                        "dddddddddddddddddddddddddddddddddddd",
                        "hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh",
                        "ggggggggggggggggggggggggg",
                      ],
                    },
                    {
                      question:
                        "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
                      answer:
                        "cccccccccccccccccccccccccccccccccccccccccccccccccccccccc",
                      options: [
                        "dddddddddddddddddddddddddddddddddddd",
                        "hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh",
                        "ggggggggggggggggggggggggg",
                      ],
                    },
                    {
                      question:
                        "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
                      answer:
                        "cccccccccccccccccccccccccccccccccccccccccccccccccccccccc",
                      options: [
                        "dddddddddddddddddddddddddddddddddddd",
                        "hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh",
                        "ggggggggggggggggggggggggg",
                      ],
                    },
                  ],
                })
              }
              className="mt-4"
            >
              Add Paragraph
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QuizCreation;
