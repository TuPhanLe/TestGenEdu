"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Hàm trộn ngẫu nhiên danh sách options
const shuffleArray = (array: string[]) => {
  return [...array].sort(() => Math.random() - 0.5); // Tạo bản sao để không thay đổi mảng gốc
};

const optionLabels = ["A", "B", "C", "D", "E"]; // Sử dụng ký hiệu ABCDE...

type MCQProps = {
  questions: {
    questionId: string;
    question: string;
    options: string[];
    answer: string;
  }[];
  onSaveAnswer: (result: { questionId: string; userAnswer: string }) => void;
  selectedOptions: Record<string, string | null>; // Nhận selectedOptions từ component cha
};

const MCQ: React.FC<MCQProps> = ({
  questions,
  onSaveAnswer,
  selectedOptions,
}) => {
  // Trộn ngẫu nhiên options chỉ 1 lần khi mount vào
  const [formattedQuestions] = useState(() =>
    questions.map((question) => ({
      ...question,
      options: shuffleArray([...question.options, question.answer]),
    }))
  );

  const handleOptionChange = (questionId: string, option: string) => {
    onSaveAnswer({ questionId, userAnswer: option }); // Lưu kết quả khi chọn câu trả lời
  };

  return (
    <div className="flex flex-col items-center justify-center w-full ">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Answer All Questions</CardTitle>
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
                        ? "default" // Hiển thị dạng mặc định nếu đã chọn
                        : "outline"
                    }
                    className="w-full text-left py-4"
                    onClick={() =>
                      handleOptionChange(question.questionId, option)
                    }
                  >
                    <div className="flex items-center">
                      <div className="p-2 px-3 mr-4 border rounded-md">
                        {optionLabels[optIndex]}
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

export default MCQ;
