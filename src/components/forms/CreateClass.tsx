"use client";

import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form"; // Import useForm
import { useMutation } from "@tanstack/react-query";
import axios from "axios"; // Import axios
import { studentColumns } from "@/components/table/components/StudentTable/studentColumns";
import { Button } from "@/components/ui/button";
import {
  StudentSelectionProvider,
  useStudentSelection,
} from "@/hooks/SelectionContext";
import {
  LecturerSelectionProvider,
  useLecturerSelection,
} from "@/hooks/SelectionContext";
import { lecturerColumns } from "../table/components/LecturerTable/lecturerColumns";
import { DataTableStudent } from "../table/components/StudentTable/data-table-student";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"; // Import Card UI
import { Input } from "@/components/ui/input"; // Import Input UI
import { DataTableLecturer } from "../table/components/LecturerTable/data-table-lecturer";

// Định nghĩa dữ liệu form
type FormData = {
  className: string; // Thuộc tính cho tên lớp
};

type Class = {
  id: string;
  name: string;
  supervisorName: string;
  studentCount: number;
};

type Student = {
  id: string;
  name: string;
  userName: string;
  email: string;
  role: string;
  status: string;
  studentId: string;
  class: string;
  department: string;
  createdAt: Date;
};

type Lecturer = {
  id: string;
  name: string;
  userName: string;
  email: string;
  status: string;
};

type Props = {
  formattedClasses: Class[];
  formattedStudents: Student[];
  formattedLecturers: Lecturer[];
};

const CreateClass = ({
  formattedClasses,
  formattedStudents,
  formattedLecturers,
}: Props) => {
  const { selectedStudentRows } = useStudentSelection(); // Lấy danh sách sinh viên đã chọn
  const { selectedLecturerRows } = useLecturerSelection(); // Lấy danh sách giảng viên đã chọn

  // Sử dụng useForm hook
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  // Sử dụng useMutation để gọi API createClass
  const { mutate: createClass, isPending } = useMutation({
    mutationFn: async (formData: FormData) => {
      const payload = {
        className: formData.className,
        students: selectedStudentRows,
        lecturers: selectedLecturerRows,
      };

      const response = await axios.post("/api/class/create", payload); // Thay đổi URL cho phù hợp với backend của bạn
      return response.data;
    },
  });

  // Xử lý khi nộp form
  const onSubmit: SubmitHandler<FormData> = (data) => {
    createClass(data); // Gọi mutation khi form được submit
  };

  // State để theo dõi trạng thái mở rộng
  const [isLecturerExpanded, setLecturerExpanded] = useState(false);
  const [isStudentExpanded, setStudentExpanded] = useState(false);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Card for Class Name Input */}
      <Card className="mb-4">
        <CardHeader className="cursor-pointer">
          <CardTitle className="text-lg font-semibold">
            Create your class name.
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            {...register("className", { required: "Class name is required" })}
            placeholder="Enter class name"
          />
          {errors.className && (
            <p className="text-red-500 text-sm mt-2">
              {errors.className.message}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Card for Lecturers */}
      <Card className="mb-4">
        <CardHeader
          onClick={() => setLecturerExpanded(!isLecturerExpanded)}
          className="cursor-pointer"
        >
          <CardTitle className="text-lg font-semibold">
            Choose lecturer
          </CardTitle>
        </CardHeader>
        {isLecturerExpanded && (
          <CardContent>
            <DataTableLecturer
              columns={lecturerColumns}
              data={formattedLecturers}
            />
          </CardContent>
        )}
      </Card>

      {/* Card for Students */}
      <Card className="mb-4">
        <CardHeader
          onClick={() => setStudentExpanded(!isStudentExpanded)}
          className="cursor-pointer"
        >
          <CardTitle className="text-lg font-semibold">
            Choose student
          </CardTitle>
        </CardHeader>
        {isStudentExpanded && (
          <CardContent>
            <DataTableStudent
              columns={studentColumns}
              data={formattedStudents}
            />
          </CardContent>
        )}
      </Card>

      {/* Submit Button */}
      <Button
        type="submit"
        className="mt-4 w-full"
        disabled={isPending} // Disable button if the request is pending
      >
        {isPending ? "Submitting..." : "Submit"}
      </Button>
    </form>
  );
};

// Bọc component CreateClass với StudentSelectionProvider và LecturerSelectionProvider
export default function App({
  formattedClasses,
  formattedStudents,
  formattedLecturers,
}: Props) {
  return (
    <StudentSelectionProvider>
      <LecturerSelectionProvider>
        <CreateClass
          formattedClasses={formattedClasses}
          formattedStudents={formattedStudents}
          formattedLecturers={formattedLecturers}
        />
      </LecturerSelectionProvider>
    </StudentSelectionProvider>
  );
}
