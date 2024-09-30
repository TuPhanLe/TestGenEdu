import React from "react";
import { getAuthSession } from "@/lib/nextauth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { DashboardAdmin } from "@/components/ComponentTesting";
import UserAnalytics from "@/components/dashboard/UserAnalytics";
import SubUserAnalytics from "@/components/dashboard/admin/SubUserAnalytics";
import { UserRole } from "@prisma/client";
import { formatDate } from "@/lib/utils";

export const metadata = {
  title: "TEST GEN EDU | DNU",
  description: "Let's make a Quiz!",
};

interface Props {
  searchParams: {
    topic?: string;
  };
}

const action = async ({ searchParams }: Props) => {
  // Get user session
  const session = await getAuthSession();
  if (!session?.user) {
    redirect("/");
  }

  if (session.user.role !== UserRole.ADMIN) {
    redirect("/not-authorized");
    return null;
  }

  const userCount = (await prisma.user.count()) - 1;

  const lecturerCount = await prisma.user.count({
    where: {
      role: "LECTURE",
    },
  });

  const studentCount = await prisma.user.count({
    where: {
      role: "STUDENT",
    },
  });
  const users = await prisma.user.findMany({
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
    createdAt: formatDate(classItem.createdAt),
  }));
  const classCount = await prisma.class.count();

  return (
    <>
      <main className="min-h-screen p-8 mx-auto max-w-7xl">
        <div className="flex items-center">
          <h2 className="mr-2 text-3xl font-bold tracking-tight">Dashboard</h2>
        </div>
        <UserAnalytics
          userCount={userCount}
          lecturerCount={lecturerCount}
          studentCount={studentCount}
          classCount={classCount}
        />
        <SubUserAnalytics users={users} classes={formattedClasses} />
      </main>
    </>
  );
};

export default action;
