import React from "react";
import { getAuthSession } from "@/lib/nextauth";
import { redirect } from "next/navigation";
import { UserRole } from "@prisma/client";
import { prisma } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import { DataTable } from "@/components/table/components/data-table";
import { studentColumns } from "@/components/table/components/columns/studentColumns";

type Props = {};

const create = async (props: Props) => {
  const session = await getAuthSession();
  if (!session?.user) {
    redirect("/");
  }

  if (session.user.role !== UserRole.ADMIN) {
    redirect("/not-authorized");
    return null;
  }
  const classes = await prisma.class.findMany({
    select: {
      id: true, // Lấy id của lớp
      name: true, // Lấy tên lớp
      createdAt: true, // Assuming createdAt is present
      supervisor: {
        select: {
          name: true, // Lấy tên giáo viên phụ trách
        },
      },
      students: true, // Đếm số lượng
    },
  });

  const formattedClasses = classes.map((classItem) => ({
    id: classItem.id,
    name: classItem.name,
    supervisorName: classItem.supervisor?.name || "No supervisor", // Lấy tên giáo viên phụ trách, nếu không có thì hiển thị 'No supervisor'
    studentCount: classItem.students.length, // Đếm số lượng  // Số lượng sinh viên trong lớp
  }));

  const students = await prisma.user.findMany({
    where: {
      role: "STUDENT", // Lọc những user có role là "STUDENT"
    },
    select: {
      id: true,
      name: true,
      userName: true,
      email: true,
      role: true,
      status: true, // Assuming status like "active" is present
      createdAt: true, // Assuming createdAt is present
      class: true,
      department: true,
      studentId: true,
    },
  });
  const formattedStudents = students.map((student) => ({
    id: student.id,
    name: student.name ?? "", // Default to empty string if null
    userName: student.userName,
    email: student.email ?? "", // Default to empty string if null
    role: student.role,
    status: student.status,
    studentId: student.studentId ?? "", // Default to empty string if null
    class: student.class ?? "", // Default to empty string if null
    department: student.department ?? "", // Default to empty string if null
    createdAt: student.createdAt,
  }));

  return (
    <>
      <main className="min-h-screen p-8 mx-auto max-w-7xl">
        <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
          {/* <DataTable data={formattedClasses} columns={columns} /> */}
          <DataTable data={formattedStudents} columns={studentColumns} />
        </div>
      </main>
    </>
  );
};

export default create;
