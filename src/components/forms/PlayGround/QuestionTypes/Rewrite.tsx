"use client";

import React, { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";

type RewriteProps = {
  questions: {
    questionId: string;
    question: string;
    answer: string;
    options: string[];
  }[];
  onSaveAnswer: (result: { questionId: string; userAnswer: string }) => void;
  selectedOptions: Record<string, string | null>; // Trạng thái câu trả lời cho từng câu hỏi
};

const Rewrite: React.FC<RewriteProps> = ({
  questions,
  onSaveAnswer,
  selectedOptions,
}) => {
  const [shuffledQuestions, setShuffledQuestions] = useState<
    RewriteProps["questions"]
  >([]);

  // Hàm trộn ngẫu nhiên các câu hỏi
  const shuffleArray = <T,>(array: T[]): T[] =>
    [...array].sort(() => Math.random() - 0.5);

  useEffect(() => {
    // Trộn câu hỏi khi component được mount lần đầu
    setShuffledQuestions(shuffleArray(questions));
  }, [questions]);

  const handleChange = (questionId: string, value: string) => {
    onSaveAnswer({ questionId, userAnswer: value }); // Cập nhật selectedOptions qua hàm cha
  };

  return (
    <div className="space-y-8">
      {shuffledQuestions.map((q, index) => (
        <div key={q.questionId} className="space-y-4">
          {/* Số thứ tự và câu hỏi */}
          <div>
            <label className="block text-sm font-medium mb-1">
              {index + 1}. Rewrite the following sentence:
            </label>
            <Textarea value={q.question} readOnly className="resize-none" />
          </div>

          {/* Nhập câu trả lời */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Your Rewritten Answer
            </label>
            <Textarea
              placeholder={q.options[0] || "Enter your rewritten answer..."}
              value={selectedOptions[q.questionId] || ""} // Hiển thị câu trả lời đã lưu
              onChange={(e) => handleChange(q.questionId, e.target.value)} // Cập nhật câu trả lời
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default Rewrite;
