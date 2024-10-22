"use client";
import React, { useEffect, useRef, useState } from "react";
import TrueFalse from "./QuestionTypes/TrueFalse";
import MCQ from "./QuestionTypes/MCQ";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import FillUp from "./QuestionTypes/FillUp";
import Matching from "./QuestionTypes/Matching";
import Rewrite from "./QuestionTypes/Rewrite";

type PartRendererProps = {
  part: any;
  onSaveAnswer: (result: { questionId: string; userAnswer: string }) => void;
  selectedOptions: Record<string, string | null>; // Nhận selectedOptions từ props
};

// Hàm để lấy tiêu đề tương ứng cho từng loại câu hỏi
const getQuestionTypeTitle = (type: string) => {
  switch (type) {
    case "mcq":
      return "Multiple Choice Question";
    case "true_false":
      return "True/False Question";
    case "matching":
      return "Matching Question";
    case "fillup":
      return "Fill in the Blanks";
    case "rewrite":
      return "Rewrite the Sentence";
    default:
      return "Unknown Question Type";
  }
};

const PartRenderer: React.FC<PartRendererProps> = React.memo(
  ({ part, onSaveAnswer, selectedOptions }) => {
    const contentRef = useRef<HTMLDivElement>(null);
    const [scrollTop, setScrollTop] = useState<number>(0);

    // Lắng nghe sự kiện cuộn và cập nhật vị trí của CardContent
    useEffect(() => {
      const handleScroll = () => setScrollTop(window.scrollY);
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
      if (contentRef.current) {
        contentRef.current.style.transform = `translateY(${scrollTop}px)`;
      }
    }, [scrollTop]);

    const renderQuestion = () => {
      switch (part.type) {
        case "mcq":
          return (
            <MCQ
              questions={part.questions}
              onSaveAnswer={onSaveAnswer}
              selectedOptions={selectedOptions}
            />
          );
        case "true_false":
          return (
            <TrueFalse
              questions={part.questions}
              onSaveAnswer={onSaveAnswer}
              selectedOptions={selectedOptions}
            />
          );
        case "fillup":
          return (
            <FillUp
              questions={part.questions}
              onSaveAnswer={onSaveAnswer}
              selectedOptions={selectedOptions}
            />
          );
        case "matching":
          return (
            <Matching
              questions={part.questions}
              onSaveAnswer={onSaveAnswer}
              selectedOptions={selectedOptions}
            />
          );
        case "rewrite":
          return (
            <div className="w-full">
              {" "}
              {/* Đảm bảo Rewrite chiếm toàn bộ chiều rộng */}
              <Rewrite
                questions={part.questions}
                onSaveAnswer={onSaveAnswer}
                selectedOptions={selectedOptions}
              />
            </div>
          );
        default:
          return <div>Unknown question type.</div>;
      }
    };

    return (
      <div
        className={`w-full grid gap-4 ${
          part.type === "rewrite" ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"
        }`}
      >
        {/* Phần Paragraph bên trái: Render nếu không phải câu hỏi 'rewrite' */}
        {part.type !== "rewrite" && (
          <div className="relative">
            <Card
              ref={contentRef}
              className="w-full transition-transform duration-300 ease-in-out"
            >
              <CardHeader>
                <CardTitle>{getQuestionTypeTitle(part.type)}</CardTitle>
              </CardHeader>
              <CardContent className="text-justify leading-relaxed whitespace-pre-wrap break-words">
                <p>{part.paragraph}</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Phần Câu hỏi bên phải */}
        <div className={`${part.type === "rewrite" ? "w-full" : ""}`}>
          {renderQuestion()}
        </div>
      </div>
    );
  }
);

export default React.memo(PartRenderer);
