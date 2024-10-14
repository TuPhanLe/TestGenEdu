import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import DropdownCRUD from "@/components/dropdownmenu/DropdownCRUD";
import TrueFalseQuestion from "./Question/TrueFalseQuestion";
import MCQQuestion from "./Question/MCQQuestion";
import FillupQuestion from "./Question/FillupQuestion";
import MatchingQuestion from "./Question/MatchingQuestion";
import RewriteQuestion from "./Question/RewriteQuestion";

interface QuestionProps {
  question: any;
  qIndex: number;
  partIndex: number;
  form: any;
  expandedQuestions: string[];
  toggleExpandQuestions: (questionId: string) => void;
  type: string; // Nhận type từ Part
  removeQuestion: () => void; // Hàm xóa question
}

const Question = ({
  question,
  qIndex,
  partIndex,
  form,
  expandedQuestions,
  toggleExpandQuestions,
  type,
  removeQuestion,
}: QuestionProps) => {
  const renderQuestionType = () => {
    switch (type) {
      case "true_false":
        return (
          <TrueFalseQuestion
            form={form}
            partIndex={partIndex}
            qIndex={qIndex}
          />
        );
      case "mcq":
        return (
          <MCQQuestion form={form} partIndex={partIndex} qIndex={qIndex} />
        );
      case "fillup":
        return (
          <FillupQuestion form={form} partIndex={partIndex} qIndex={qIndex} />
        );
      case "matching":
        return (
          <MatchingQuestion form={form} partIndex={partIndex} qIndex={qIndex} />
        );
      case "rewrite":
        return (
          <RewriteQuestion form={form} partIndex={partIndex} qIndex={qIndex} />
        );
      default:
        return null;
    }
  };

  return (
    <Card key={question.id} className="mt-6 p-1 m-4">
      <CardHeader>
        <CardTitle className="text-xl font-bold">
          <div className="flex justify-between items-center cursor-pointer">
            <span
              className="cursor-pointer"
              onClick={() => toggleExpandQuestions(question.questionId)}
            >
              Question {qIndex + 1}
            </span>
            <DropdownCRUD
              edit={() => toggleExpandQuestions(question.questionId)}
              delete={removeQuestion} // Thêm tính năng xóa câu hỏi
            />
          </div>
        </CardTitle>
      </CardHeader>

      {expandedQuestions.includes(question.questionId) && (
        <CardContent>{renderQuestionType()}</CardContent>
      )}
    </Card>
  );
};

export default Question;
