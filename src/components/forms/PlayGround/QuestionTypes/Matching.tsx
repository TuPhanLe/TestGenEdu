"use client";

import React, { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";

type MatchingQuestionType = {
  questionId: string;
  question: string;
  answer: string;
};

type MatchingProps = {
  questions: MatchingQuestionType[];
  onSaveAnswer: (result: { questionId: string; userAnswer: string }) => void;
  selectedOptions: Record<string, string | null>;
};

const Matching: React.FC<MatchingProps> = ({
  questions,
  onSaveAnswer,
  selectedOptions,
}) => {
  const [availableAnswers] = useState<string[]>(() =>
    [...questions.map((q) => q.answer)].sort(() => Math.random() - 0.5)
  );

  const handleSelectAnswer = useCallback(
    (questionId: string, answer: string) => {
      onSaveAnswer({ questionId, userAnswer: answer });
    },
    [onSaveAnswer]
  );

  return (
    <TooltipProvider>
      <div className="space-y-8">
        <Card className="w-full p-4">
          <CardHeader>
            <CardTitle>Matching Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-8">
              {/* Cột bên trái: Câu hỏi */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Questions</h3>
                {questions.map((q, index) => (
                  <Tooltip key={q.questionId}>
                    <TooltipTrigger asChild>
                      <div className="truncate w-full" title={q.question}>
                        <p className="text-lg">
                          {index + 1}. {q.question}
                        </p>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>{q.question}</TooltipContent>
                  </Tooltip>
                ))}
              </div>

              {/* Cột bên phải: Đáp án */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Answers</h3>
                {availableAnswers.map((answer, index) => (
                  <Tooltip key={index}>
                    <TooltipTrigger asChild>
                      <div
                        className={`flex items-center space-x-2 truncate ${
                          Object.values(selectedOptions).includes(answer)
                            ? "opacity-50"
                            : ""
                        }`}
                        title={answer}
                      >
                        <div className="p-2 border rounded-md">
                          {String.fromCharCode(65 + index)}
                        </div>
                        <span>{answer}</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>{answer}</TooltipContent>
                  </Tooltip>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dropdown chọn đáp án */}
        <div className="space-y-4">
          {questions.map((q) => (
            <div key={q.questionId} className="flex items-center space-x-4">
              <p className="w-1/2 truncate" title={q.question}>
                {q.question}
              </p>
              <Select
                onValueChange={(value) =>
                  handleSelectAnswer(q.questionId, value)
                }
                value={selectedOptions[q.questionId] || ""}
              >
                <SelectTrigger className="w-full">
                  <SelectValue>
                    {selectedOptions[q.questionId] || "Select an answer"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {availableAnswers.map((answer, index) => (
                    <SelectItem key={index} value={answer}>
                      {String.fromCharCode(65 + index)}. {answer}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>
      </div>
    </TooltipProvider>
  );
};

export default Matching;
