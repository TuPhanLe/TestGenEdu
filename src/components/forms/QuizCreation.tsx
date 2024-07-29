"use client";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { useFieldArray, useForm, Controller } from "react-hook-form";
import { quizCreationSchema } from "@/schemas/form/quiz";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  BookOpen,
  CopyCheck,
  Trash,
  Plus,
  Image,
  Video,
  Text,
  Delete,
  Minus,
} from "lucide-react";
import { Separator } from "../ui/separator";
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
type Props = {};

type Input = z.infer<typeof quizCreationSchema>;

const QuizCreation = (props: Props) => {
  const { mutate: getQuestions, isLoading } = useMutation({
    mutationFn: async ({ topic, type, questions }: Input) => {
      const response = await axios.post("/api/game", {
        topic,
        type,
        questions,
      });
      return response.data;
    },
  });

  const form = useForm<Input>({
    resolver: zodResolver(quizCreationSchema),
    defaultValues: {
      topic: "Semmester",
      type: "mcq",
      questions: [
        {
          question: "Ai la nguoi bo con?",
          answer: "Jack",
          options: ["Decao", "Thang-Ngot", "Dat G"],
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "questions",
  });

  function onSubmit(data: Input) {
    getQuestions(
      {
        topic: data.topic,
        questions: data.questions,
        type: data.type,
      },
      {
        onSuccess: ({ gameId }) => {
          alert(gameId);
        },
      }
    );
  }
  form.watch();

  return (
    <div className="relative flex justify-center">
      <div className="w-1/2">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Quiz Creation</CardTitle>
            <CardDescription>Choose a topic</CardDescription>
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
                      <FormDescription>Please provide a topic.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-between">
                  <Button
                    variant={
                      form.getValues("type") === "mcq" ? "default" : "secondary"
                    }
                    className="w-1/2 rounded-none rounded-l-lg"
                    onClick={() => form.setValue("type", "mcq")}
                    type="button"
                  >
                    <CopyCheck className="w-4 h-4 mr-2" /> Multiple Choice
                  </Button>
                  <Separator orientation="vertical" />
                  <Button
                    variant={
                      form.getValues("type") === "open_ended"
                        ? "default"
                        : "secondary"
                    }
                    className="w-1/2 rounded-none rounded-r-lg"
                    onClick={() => form.setValue("type", "open_ended")}
                    type="button"
                  >
                    <BookOpen className="w-4 h-4 mr-2" /> Open Ended
                  </Button>
                </div>
                {fields.map((item, index) => (
                  <Card key={item.id}>
                    <CardHeader>
                      <CardTitle className="text-1xl font-bold">
                        Question {index + 1}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="relative">
                      <FormField
                        control={form.control}
                        name={`questions.${index}.question`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Question</FormLabel>
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
                        name={`questions.${index}.answer`}
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
                            .getValues(`questions.${index}.options`)
                            .map((_, optIndex) => (
                              <div
                                key={optIndex}
                                className="flex items-center w-full"
                              >
                                <FormField
                                  control={form.control}
                                  name={`questions.${index}.options.${optIndex}`}
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
                                <Button
                                  type="button"
                                  onClick={() => {
                                    const options =
                                      form.getValues(
                                        `questions.${index}.options`
                                      ) ?? [];
                                    if (options.length > 3) {
                                      const newOptions = options.filter(
                                        (_, i) => i !== optIndex
                                      );
                                      form.setValue(
                                        `questions.${index}.options`,
                                        newOptions
                                      );
                                    } else {
                                      alert(
                                        "You must have at least 3 options."
                                      );
                                    }
                                  }}
                                >
                                  <Trash />
                                </Button>
                              </div>
                            ))}
                          <Button
                            type="button"
                            onClick={() => {
                              const options =
                                form.getValues(`questions.${index}.options`) ??
                                [];
                              console.log(options);

                              const newOptions = [...options, ""];
                              form.setValue(
                                `questions.${index}.options`,
                                newOptions
                              );
                            }}
                          >
                            Add Option
                          </Button>
                        </>
                      )}
                      <div className="absolute -top-20 -right-20 transform -translate-x-1/2  flex flex-col bg-white border border-gray-300 rounded-lg shadow-lg p-2 z-50">
                        <Button
                          onClick={() =>
                            append({
                              question: "",
                              answer: "",
                              options: ["", "", ""],
                            })
                          }
                          className="block bg-none border-none my-2"
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                        <Button
                          className="block bg-none border-none my-2"
                          onClick={() => {
                            if (index === 0) {
                              alert("You must have at least 1 question");
                            } else remove(index);
                          }}
                        >
                          <Trash className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                <Button type="submit">Submit</Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QuizCreation;
