import React from "react";
import TrueFalse from "./QuestionTypes/TrueFalse";
import MCQ from "./QuestionTypes/MCQ";

type PartRendererProps = {
  part: any;
};

const PartRenderer: React.FC<PartRendererProps> = ({ part }) => {
  const renderQuestion = () => {
    switch (part.type) {
      case "mcq":
        return <MCQ questions={part.questions} />;
      case "true_false":
        return <TrueFalse questions={part.questions} />;
      //   case "matching":
      //     return <Matching questions={part.questions} />;
      //   case "fillup":
      //     return <Fillup questions={part.questions} />;
      //   case "rewrite":
      //     return <Rewrite questions={part.questions} />;
      default:
        return <div>Unknown question type.</div>;
    }
  };

  return (
    <div className="part-section">
      <h2>{part.type.toUpperCase()}</h2>
      <p>{part.paragraph}</p>
      {renderQuestion()}
    </div>
  );
};

export default PartRenderer;
