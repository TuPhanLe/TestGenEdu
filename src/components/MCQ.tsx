"use client";
import { Test, Question, Part } from "@prisma/client";
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
  attemptNumber: number;
  timeStarted: Date;
  game: Test & {
    parts: (Pick<Part, "id" | "content"> & {
      questions: Pick<Question, "id" | "question" | "options">[];
    })[];
  };
};

const MCQ = ({ attemptNumber, timeStarted, game }: Props) => {
  const [partIndex, setpartIndex] = React.useState(0);
  const [questionIndex, setQuestionIndex] = React.useState(0);
  const [selectedChoice, setSelectedChoice] = React.useState<number>(0);
  const [correctAnswers, setCorrectAnswers] = React.useState<number>(0);
  const [wrongAnswers, setWrongAnswers] = React.useState<number>(0);
  const [hasEnded, setHasEnded] = React.useState<boolean>(false);
  const [now, setNow] = React.useState<Date>(new Date());
  const { toast } = useToast();
  const [isMounted, setIsMounted] = React.useState(false);
  const hasFinishedRef = React.useRef(false);
  const endTime = React.useMemo(() => {
    if (!timeStarted || !game.testDuration) return null;
    return new Date(timeStarted.getTime() + game.testDuration * 60 * 1000); // Multiply by 1000 to convert minutes to milliseconds
  }, [timeStarted, game.testDuration]);

  const remainingTime = React.useMemo(() => {
    if (!endTime) return 0;
    return Math.max(0, differenceInSeconds(endTime, now)); // Use `now`
  }, [endTime, now]);

  const elapsedTime = React.useMemo(() => {
    return differenceInSeconds(now, timeStarted); // Time since start
  }, [now, timeStarted]);

  React.useEffect(() => {
    setIsMounted(true);
    const interval = setInterval(() => {
      if (!hasEnded) {
        setNow(new Date()); // Update `now` each second
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [hasEnded]);

  React.useEffect(() => {
    if (remainingTime <= 0 && !hasEnded) {
      setHasEnded(true); // End the timer if remaining time is 0 or less
    }
  }, [remainingTime, hasEnded]);

  const currentpart = React.useMemo(
    () => game.parts[partIndex],
    [partIndex, game.parts]
  );
  const currentQuestion = React.useMemo(
    () => currentpart.questions[questionIndex],
    [questionIndex, currentpart]
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
  const { mutate: updateTestResult, isPending: isUpdating } = useMutation({
    mutationFn: async () => {
      const payload = {
        testId: game.id,
        startTime: timeStarted.toISOString(),
        endTime: now.toISOString(),
      };
      const response = await axios.post("/api/result/finish", payload);
      return response.data;
    },
    onSuccess: () => {
      toast({
        title: "Results Updated!",
        description: "Your test results have been successfully updated.",
        variant: "success",
      });
    },
    onError: () => {
      toast({
        title: "Error!",
        description: "There was an error updating the results.",
        variant: "destructive",
      });
    },
  });
  const handleFinish = React.useCallback(() => {
    if (isUpdating) return;
    updateTestResult();
  }, [updateTestResult, isUpdating]);

  React.useEffect(() => {
    if (hasEnded && !hasFinishedRef.current) {
      handleFinish(); // Gọi `handleFinish` khi bài thi kết thúc
      hasFinishedRef.current = true; // Đánh dấu là đã hoàn thành
    }
  }, [hasEnded, handleFinish]);
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
        if (questionIndex === currentpart.questions.length - 1) {
          if (partIndex === game.parts.length - 1) {
            setHasEnded(true);
            return;
          }
          setpartIndex((prev) => prev + 1);
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
    currentpart.questions.length,
    partIndex,
    game.parts.length,
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
      <div className="fixed flex flex-col justify-center top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 ">
        <div className="px-4 mt-2 font-semibold text-white bg-green-500 whitespace-nowrap">
          You completed in{" "}
          {isMounted && (
            <>
              <div>{formatTimeDelta(elapsedTime)} </div>
            </>
          )}
        </div>
        <Link
          href={`/stu/statistics/${game.id}/${attemptNumber}`}
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
            {isMounted && formatTimeDelta(remainingTime)}
          </div>
        </div>
        <MCQCounter
          correctAnswers={correctAnswers}
          wrongAnswers={wrongAnswers}
        />
      </div>

      {/* Card for part Content */}
      <Card className="w-full mt-4">
        <CardHeader>
          <CardTitle>part {partIndex + 1}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{currentpart?.content}</p>
        </CardContent>
      </Card>

      {/* Card for Question */}
      <Card className="w-full mt-4">
        <CardHeader className="flex flex-row items-center">
          <CardTitle className="mr-5 text-center divide-y divide-zinc-600/50">
            <div>Question {questionIndex + 1}</div>
            <div className="text-base text-slate-400">
              {currentpart?.questions.length}
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
