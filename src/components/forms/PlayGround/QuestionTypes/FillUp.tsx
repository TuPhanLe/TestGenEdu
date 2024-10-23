"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Hàm trộn ngẫu nhiên danh sách lựa chọn
const shuffleArray = (array: string[]) => {
  return [...array].sort(() => Math.random() - 0.5); // Tạo bản sao để không thay đổi mảng gốc
};

const optionLabels = ["A", "B", "C", "D", "E"]; // Gán nhãn ABCDE cho các lựa chọn

type FillUpQuestion = {
  questionId: string;
  question: string;
  options: string[];
  answer: string;
};

type FillUpProps = {
  questions: FillUpQuestion[];
  onSaveAnswer: (result: { questionId: string; userAnswer: string }) => void;
  selectedOptions: Record<string, string | null>; // Nhận selectedOptions từ component cha
};

const FillUp: React.FC<FillUpProps> = ({
  questions,
  onSaveAnswer,
  selectedOptions, // Nhận selectedOptions từ component cha
}) => {
  // Trộn ngẫu nhiên các lựa chọn chỉ một lần khi component được mount
  const [formattedQuestions] = useState(() =>
    questions.map((question) => ({
      ...question,
      options: shuffleArray([...question.options, question.answer]),
    }))
  );

  const handleOptionChange = (questionId: string, option: string) => {
    onSaveAnswer({ questionId, userAnswer: option }); // Lưu lựa chọn khi người dùng chọn
  };

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>
            Please read each question carefully and select the most accurate
            answer
          </CardTitle>
        </CardHeader>
        <CardContent>
          {formattedQuestions.map((question, index) => (
            <div key={question.questionId} className="mb-8">
              <h3 className="text-lg font-semibold mb-4">
                {index + 1}. {question.question}
              </h3>
              <div className="grid gap-4">
                {question.options.map((option, optIndex) => (
                  <Button
                    justify="start"
                    key={optIndex}
                    variant={
                      selectedOptions[question.questionId] === option
                        ? "default" // Đã chọn: hiển thị dạng mặc định
                        : "outline" // Chưa chọn: hiển thị dạng outline
                    }
                    className="w-full text-left py-4"
                    onClick={() =>
                      handleOptionChange(question.questionId, option)
                    }
                  >
                    <div className="flex items-center">
                      <div className="p-2 px-3 mr-4 border rounded-md">
                        {optionLabels[optIndex]}{" "}
                        {/* Gán nhãn ABCD cho lựa chọn */}
                      </div>
                      <div>{option}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default FillUp;
