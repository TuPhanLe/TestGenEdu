"use client";
import React, { useState, useEffect } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type FillUpQuestion = {
  questionId: string;
  question: string; // Nội dung câu hỏi
  options: string[]; // Các lựa chọn
  answer: string; // Đáp án đúng
};

type FillUpProps = {
  questions: FillUpQuestion[];
  onSaveAnswer: (result: { questionId: string; userAnswer: string }) => void;
};
const shuffleArray = (array: string[]) => {
  return [...array].sort(() => Math.random() - 0.5); // Tạo bản sao để không thay đổi mảng gốc
};
const FillUp: React.FC<FillUpProps> = ({ questions, onSaveAnswer }) => {
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string | null>
  >(() => questions.reduce((acc, q) => ({ ...acc, [q.questionId]: null }), {}));
  const [formattedQuestions, setFormattedQuestions] = useState(() =>
    questions.map((question) => ({
      ...question,
      options: shuffleArray([...question.options, question.answer]),
    }))
  );

  const handleOptionChange = (questionId: string, option: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [questionId]: option,
    }));
    onSaveAnswer({ questionId, userAnswer: option }); // Lưu kết quả khi chọn câu trả lời
  };
  useEffect(() => {
    setFormattedQuestions(
      questions.map((question) => ({
        ...question,
        options: shuffleArray([...question.options, question.answer]),
      }))
    );
    setSelectedOptions(
      questions.reduce((acc, q) => ({ ...acc, [q.questionId]: null }), {})
    );
  }, [questions]);

  return (
    <div className="flex flex-col items-center justify-center w-full">
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
                        ? "default"
                        : "outline"
                    }
                    className="w-full text-left py-4" // Căn trái nội dung
                    onClick={() =>
                      handleOptionChange(question.questionId, option)
                    }
                  >
                    <div className="flex items-center">
                      <div className="p-2 px-3 mr-4 border rounded-md">
                        {String.fromCharCode(65 + optIndex)} {/* ABCD */}
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
