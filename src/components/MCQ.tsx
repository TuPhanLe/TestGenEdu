"use client";
import { Test, Question, Paragraph } from "@prisma/client";
import { differenceInSeconds } from "date-fns";
import { BarChart, ChevronRight, Timer } from "lucide-react";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button, buttonVariants } from "./ui/button";
import MCQCounter from "./MCQCounter";
import { useMutation } from "@tanstack/react-query";
import { checkAnswerSchema } from "@/schemas/form/test";
import { z } from "zod";
import axios from "axios";
import { useToast } from "./ui/use-toast";
import Link from "next/link";
import { cn, formatTimeDelta } from "@/lib/utils";

type Props = {
  game: Test & {
    paragraphs: (Pick<Paragraph, "id" | "content"> & {
      questions: Pick<Question, "id" | "question" | "options">[];
    })[];
  };
};

const MCQ = ({ game }: Props) => {
  const [paragraphIndex, setParagraphIndex] = React.useState(0);
  const [questionIndex, setQuestionIndex] = React.useState(0);
  const [selectedChoice, setSelectedChoice] = React.useState<number>(0);
  const [correctAnswers, setCorrectAnswers] = React.useState<number>(0);
  const [wrongAnswers, setWrongAnswers] = React.useState<number>(0);
  const [hasEnded, setHasEnded] = React.useState<boolean>(false);
  const [now, setNow] = React.useState<Date>(new Date());
  const { toast } = useToast();
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  React.useEffect(() => {
    const interval = setInterval(() => {
      if (!hasEnded) {
        setNow(new Date());
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [hasEnded]);

  const currentParagraph = React.useMemo(
    () => game.paragraphs[paragraphIndex],
    [paragraphIndex, game.paragraphs]
  );
  const currentQuestion = React.useMemo(
    () => currentParagraph.questions[questionIndex],
    [questionIndex, currentParagraph]
  );

  const { mutate: checkAnswer, isPending: isChecking } = useMutation({
    mutationFn: async () => {
      const payload: z.infer<typeof checkAnswerSchema> = {
        questionId: currentQuestion.id,
        userInput: options[selectedChoice],
      };
      const response = await axios.post("/api/checkAnswer", payload);
      return response.data;
    },
  });

  const handleNext = React.useCallback(() => {
    if (isChecking) return;
    checkAnswer(undefined, {
      onSuccess: ({ isCorrect }) => {
        if (isCorrect) {
          toast({
            title: "Correct!",
            description: "Correct Answer!",
            variant: "success",
          });
          setCorrectAnswers((prev) => prev + 1);
        } else {
          toast({
            title: "Incorrect!",
            description: "Incorrect Answer!",
            variant: "destructive",
          });
          setWrongAnswers((prev) => prev + 1);
        }
        if (questionIndex === currentParagraph.questions.length - 1) {
          if (paragraphIndex === game.paragraphs.length - 1) {
            setHasEnded(true);
            return;
          }
          setParagraphIndex((prev) => prev + 1);
          setQuestionIndex(0);
        } else {
          setQuestionIndex((prev) => prev + 1);
        }
      },
    });
  }, [
    checkAnswer,
    toast,
    isChecking,
    questionIndex,
    currentParagraph.questions.length,
    paragraphIndex,
    game.paragraphs.length,
  ]);

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "1") {
        setSelectedChoice(0);
      } else if (event.key === "2") {
        setSelectedChoice(1);
      } else if (event.key === "3") {
        setSelectedChoice(2);
      } else if (event.key === "4") {
        setSelectedChoice(3);
      } else if (event.key === "Enter") {
        handleNext();
      }
    };
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleNext]);

  const options = React.useMemo(() => {
    if (!currentQuestion) return [];
    if (!currentQuestion.options) return [];
    return JSON.parse(currentQuestion.options as string) as string[];
  }, [currentQuestion]);

  if (hasEnded) {
    return (
      <div className="absolute flex flex-col justify-center top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 ">
        <div className="px-4 mt-2 font-semibold text-white bg-green-500 whitespace-nowrap">
          You completed in{" "}
          {isMounted &&
            formatTimeDelta(differenceInSeconds(now, game.timeStarted))}
        </div>
        <Link
          href={`/stu/statistics/${game.id}`}
          className={cn(buttonVariants(), "mt-2")}
        >
          View Statistics
          <BarChart className="w-4 h-4 ml-2" />
        </Link>
      </div>
    );
  }

  return (
    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 md:w-[80vw] max-w-4xl w-[90vw]">
      <div className="flex flex-row justify-between ">
        <div className="flex flex-col">
          {/* topic */}
          <p>
            <span className="text-slate-400 mr-2">Topic</span>
            <span className="px-2 py-1 text-white rounded-lg bg-slate-800">
              {game.topic}
            </span>
          </p>
          <div className="flex self-start mt-3 text-slate-400">
            <Timer className="mr-2" />
            {isMounted &&
              formatTimeDelta(differenceInSeconds(now, game.timeStarted))}
          </div>
        </div>
        <MCQCounter
          correctAnswers={correctAnswers}
          wrongAnswers={wrongAnswers}
        />
      </div>

      {/* Card for Paragraph Content */}
      <Card className="w-full mt-4">
        <CardHeader>
          <CardTitle>Paragraph {paragraphIndex + 1}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{currentParagraph?.content}</p>
        </CardContent>
      </Card>

      {/* Card for Question */}
      <Card className="w-full mt-4">
        <CardHeader className="flex flex-row items-center">
          <CardTitle className="mr-5 text-center divide-y divide-zinc-600/50">
            <div>Question {questionIndex + 1}</div>
            <div className="text-base text-slate-400">
              {currentParagraph?.questions.length}
            </div>
          </CardTitle>
          <CardDescription className="flex-grow text-lg">
            {currentQuestion?.question}
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="flex flex-col items-center justify-center w-full mt-4">
        {options.map((option, index) => {
          return (
            <Button
              key={index}
              variant={selectedChoice === index ? "default" : "secondary"}
              className="justify-start w-full py-8 mb-4"
              onClick={() => {
                setSelectedChoice(index);
              }}
            >
              <div className="flex items-center justify-start">
                <div className="p-2 px-3 mr-5 border rounded-md">
                  {index + 1}
                </div>
                <div className="text-start">{option}</div>
              </div>
            </Button>
          );
        })}
        <Button
          className="mt-2"
          disabled={isChecking}
          onClick={() => {
            handleNext();
          }}
        >
          Next <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default MCQ;
