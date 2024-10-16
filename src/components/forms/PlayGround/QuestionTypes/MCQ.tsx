"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, CheckCircle, XCircle } from "lucide-react";

type MCQProps = {
  questions: {
    questionId: string;
    question: string;
    options: string[];
    answer: string;
  }[];
  onComplete: (score: number) => void; // Hàm callback để gửi kết quả khi hoàn thành
};

const MCQ: React.FC<MCQProps> = ({ questions, onComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [correctAnswers, setCorrectAnswers] = useState<number>(0);
  const [showFeedback, setShowFeedback] = useState<boolean>(false);

  const currentQuestion = questions[currentQuestionIndex];

  const handleOptionChange = (option: string) => {
    setSelectedOption(option);
  };

  const handleNext = () => {
    // Kiểm tra câu trả lời
    if (selectedOption === currentQuestion.answer) {
      setCorrectAnswers((prev) => prev + 1);
    }
    setShowFeedback(true); // Hiển thị feedback sau mỗi câu

    // Chuyển sang câu hỏi tiếp theo sau khi hiện feedback
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
      } else {
        onComplete(correctAnswers); // Kết thúc bài kiểm tra và gửi kết quả
      }
      setSelectedOption(null); // Reset lựa chọn cho câu tiếp theo
      setShowFeedback(false); // Tắt feedback
    }, 1000);
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <Card className="w-full max-w-xl mt-4">
        <CardHeader>
          <CardTitle>
            Question {currentQuestionIndex + 1} of {questions.length}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <h3 className="mb-4 text-lg font-semibold">
            {currentQuestion.question}
          </h3>
          {currentQuestion.options.map((option, index) => (
            <div key={index} className="flex items-center mb-2">
              <input
                type="radio"
                name={`question-${currentQuestion.questionId}`}
                value={option}
                checked={selectedOption === option}
                onChange={() => handleOptionChange(option)}
                className="mr-2"
              />
              <label className="text-lg">{option}</label>
            </div>
          ))}
          {showFeedback && (
            <div className="flex items-center mt-4">
              {selectedOption === currentQuestion.answer ? (
                <CheckCircle className="text-green-500 mr-2" />
              ) : (
                <XCircle className="text-red-500 mr-2" />
              )}
              <p>
                {selectedOption === currentQuestion.answer
                  ? "Correct!"
                  : `Incorrect! The correct answer is "${currentQuestion.answer}"`}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Button
        onClick={handleNext}
        disabled={!selectedOption}
        className="mt-6 w-full max-w-xs"
      >
        {currentQuestionIndex === questions.length - 1 ? "Finish" : "Next"}
        <ChevronRight className="ml-2" />
      </Button>
    </div>
  );
};

export default MCQ;
