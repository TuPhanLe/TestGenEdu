"use client";
import React, { useEffect, useRef, useState } from "react";
import TrueFalse from "./QuestionTypes/TrueFalse";
import MCQ from "./QuestionTypes/MCQ";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import FillUp from "./QuestionTypes/FillUp";

type PartRendererProps = {
  part: any;
  onSaveAnswer: (result: { questionId: string; userAnswer: string }) => void;
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
  ({ part, onSaveAnswer }) => {
    const contentRef = useRef<HTMLDivElement>(null);
    const [scrollTop, setScrollTop] = useState<number>(0);

    // Hàm lắng nghe sự kiện cuộn và cập nhật vị trí của CardContent
    useEffect(() => {
      const handleScroll = () => {
        setScrollTop(window.scrollY); // Lấy vị trí scroll hiện tại của trang
      };

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
          return <MCQ questions={part.questions} onSaveAnswer={onSaveAnswer} />;
        case "true_false":
          return (
            <TrueFalse questions={part.questions} onSaveAnswer={onSaveAnswer} />
          );
        case "fillup":
          return (
            <FillUp questions={part.questions} onSaveAnswer={onSaveAnswer} />
          );
        default:
          return <div>Unknown question type.</div>;
      }
    };

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        {/* Phần Paragraph bên trái */}
        <div className="relative">
          <Card
            ref={contentRef}
            className="w-full transition-transform duration-300 ease-in-out"
          >
            <CardHeader>
              <CardTitle>{getQuestionTypeTitle(part.type)}</CardTitle>
            </CardHeader>
            <CardContent
              className="
                text-justify leading-relaxed 
                whitespace-pre-wrap break-words"
            >
              <p>{part.paragraph}</p>
            </CardContent>
          </Card>
        </div>

        {/* Phần Câu hỏi bên phải */}
        <div className="  mt-4 md:mt-0">{renderQuestion()}</div>
      </div>
    );
  }
);

export default React.memo(PartRenderer);
