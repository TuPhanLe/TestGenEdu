"use client";

import React, { useState } from "react";
import { DataTableLecturer } from "@/components/table/components/data-table-lecturer";
import { studentColumns } from "@/components/table/components/columns/studentColumns";
import { Button } from "@/components/ui/button";
import {
  StudentSelectionProvider,
  useStudentSelection,
} from "@/hooks/SelectionContext";
import {
  LecturerSelectionProvider,
  useLecturerSelection,
} from "@/hooks/SelectionContext";
import { lecturerColumns } from "../table/components/columns/lecturerColumns";
import { DataTableStudent } from "../table/components/data-table-student";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"; // Import Card UI

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
  formattedLecturers: Lecturer[]; // Thêm prop cho giảng viên
};

const CreateClass = ({
  formattedClasses,
  formattedStudents,
  formattedLecturers,
}: Props) => {
  const { selectedStudentRows } = useStudentSelection(); // Lấy danh sách sinh viên đã chọn
  const { selectedLecturerRows } = useLecturerSelection(); // Lấy danh sách giảng viên đã chọn

  const handleSubmit = () => {
    console.log("Selected Students:", selectedStudentRows);
    console.log("Selected Lecturers:", selectedLecturerRows);
    // Thực hiện hành động với các hàng được chọn
  };

  // State để theo dõi trạng thái mở rộng
  const [isLecturerExpanded, setLecturerExpanded] = useState(false);
  const [isStudentExpanded, setStudentExpanded] = useState(false);

  return (
    <div>
      {/* Card for Lecturers */}
      <Card className="mb-4">
        <CardHeader
          onClick={() => setLecturerExpanded(!isLecturerExpanded)}
          className="cursor-pointer"
        >
          <CardTitle className="text-lg font-semibold">
            Lecturers Table
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
            Students Table
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
      <Button onClick={handleSubmit} className="mt-4">
        Submit Selected Rows
      </Button>
    </div>
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
