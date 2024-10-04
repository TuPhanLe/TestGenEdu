import React, { createContext, useContext, useState } from "react";

// Tạo context để quản lý trạng thái chọn hàng cho học sinh
const StudentSelectionContext = createContext<{
  selectedStudentRows: any[];
  setSelectedStudentRows: React.Dispatch<React.SetStateAction<any[]>>;
} | null>(null);

// Tạo context để quản lý trạng thái chọn hàng cho giảng viên
const LecturerSelectionContext = createContext<{
  selectedLecturerRows: any[];
  setSelectedLecturerRows: React.Dispatch<React.SetStateAction<any[]>>;
} | null>(null);

// Tạo provider để bọc component cha cho học sinh
export const StudentSelectionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [selectedStudentRows, setSelectedStudentRows] = useState<any[]>([]);

  return (
    <StudentSelectionContext.Provider
      value={{ selectedStudentRows, setSelectedStudentRows }}
    >
      {children}
    </StudentSelectionContext.Provider>
  );
};

// Tạo provider để bọc component cha cho giảng viên
export const LecturerSelectionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [selectedLecturerRows, setSelectedLecturerRows] = useState<any[]>([]);

  return (
    <LecturerSelectionContext.Provider
      value={{ selectedLecturerRows, setSelectedLecturerRows }}
    >
      {children}
    </LecturerSelectionContext.Provider>
  );
};

// Custom hook để dễ dàng sử dụng context trong các component cho học sinh
export const useStudentSelection = () => {
  const context = useContext(StudentSelectionContext);
  if (!context) {
    throw new Error(
      "useStudentSelection must be used within a StudentSelectionProvider"
    );
  }
  return context;
};

// Custom hook để dễ dàng sử dụng context trong các component cho giảng viên
export const useLecturerSelection = () => {
  const context = useContext(LecturerSelectionContext);
  if (!context) {
    throw new Error(
      "useLecturerSelection must be used within a LecturerSelectionProvider"
    );
  }
  return context;
};
