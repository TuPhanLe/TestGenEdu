"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type TrueFalseProps = {
  questions: {
    questionId: string;
    question: string;
  }[];
  onSaveAnswer: (result: { questionId: string; userAnswer: string }) => void; // Callback để lưu kết quả
  selectedOptions: Record<string, string | null>; // Nhận selectedOptions từ component cha
};

const TrueFalse: React.FC<TrueFalseProps> = ({
  questions,
  onSaveAnswer,
  selectedOptions, // Nhận selectedOptions từ component cha
}) => {
  const handleOptionChange = (questionId: string, answer: string) => {
    onSaveAnswer({ questionId, userAnswer: answer }); // Gọi callback khi chọn câu trả lời
  };

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <Card className="w-full ">
        <CardHeader>
          <CardTitle>
            Please read each question carefully and select the most accurate
            answer
          </CardTitle>
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
                    selectedOptions[question.questionId] === "true"
                      ? "default" // Đã chọn "True"
                      : "outline" // Chưa chọn
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
                    selectedOptions[question.questionId] === "false"
                      ? "default" // Đã chọn "False"
                      : "outline" // Chưa chọn
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
