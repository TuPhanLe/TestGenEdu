import React from "react";

type TrueFalseProps = {
  questions: any[];
};

const TrueFalse: React.FC<TrueFalseProps> = ({ questions }) => {
  return (
    <div>
      {questions.map((question, index) => (
        <div key={question.questionId}>
          <h3>
            {index + 1}. {question.question}
          </h3>
          <div>
            <input type="radio" name={question.questionId} value="true" />
            <label>True</label>
            <input type="radio" name={question.questionId} value="false" />
            <label>False</label>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TrueFalse;
