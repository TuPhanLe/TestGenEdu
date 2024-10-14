import React from "react";
import { Button } from "@/components/ui/button";
import cuid from "cuid";
import { UseFieldArrayAppend } from "react-hook-form";

interface AddPartProps {
  append: UseFieldArrayAppend<any>; // Hàm append từ useFieldArray để thêm part mới
}

const AddPart = ({ append }: AddPartProps) => {
  // Hàm thêm một part mới
  const handleAddPart = () => {
    append({
      partId: cuid(),
      part: "",
      type: "mcq", // Loại mặc định là "mcq", bạn có thể điều chỉnh theo yêu cầu
      questions: [
        {
          questionId: cuid(),
          question: "",
          answer: "",
          options: ["", "", ""], // Các lựa chọn mặc định
        },
      ],
    });
  };

  return (
    <div className="flex justify-end mt-4">
      <Button type="button" onClick={handleAddPart} variant="outline">
        Add Part
      </Button>
    </div>
  );
};

export default AddPart;
