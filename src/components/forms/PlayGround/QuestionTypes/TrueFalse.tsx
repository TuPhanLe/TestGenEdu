"use client";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type TrueFalseProps = {
  questions: {
    questionId: string;
    question: string;
  }[];
  onSaveAnswer: (result: { questionId: string; userAnswer: string }) => void; // Callback để lưu kết quả
};

const TrueFalse: React.FC<TrueFalseProps> = ({ questions, onSaveAnswer }) => {
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<string, string | null>
  >(() => questions.reduce((acc, q) => ({ ...acc, [q.questionId]: null }), {}));

  const handleOptionChange = (questionId: string, answer: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
    onSaveAnswer({ questionId, userAnswer: answer }); // Gọi callback khi chọn câu trả lời
  };

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <Card className="w-full ">
        <CardHeader>
          <CardTitle>Answer True/False Questions</CardTitle>
        </CardHeader>
        <CardContent>
          {questions.map((question, index) => (
            <div key={question.questionId} className="mb-8">
              <h3 className="text-lg font-semibold mb-4">
                {index + 1}. {question.question}
              </h3>
              <div className="flex gap-4">
                <Button
                  variant={
                    selectedAnswers[question.questionId] === "true"
                      ? "default"
                      : "outline"
                  }
                  className="w-1/2"
                  onClick={() =>
                    handleOptionChange(question.questionId, "true")
                  }
                >
                  True
                </Button>
                <Button
                  variant={
                    selectedAnswers[question.questionId] === "false"
                      ? "default"
                      : "outline"
                  }
                  className="w-1/2"
                  onClick={() =>
                    handleOptionChange(question.questionId, "false")
                  }
                >
                  False
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default TrueFalse;
