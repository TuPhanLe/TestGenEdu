import React from "react";
import { getAuthSession } from "@/lib/nextauth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { DashboardAdmin } from "@/components/ComponentTesting";
import UserAnalytics from "@/components/dashboard/UserAnalytics";
import SubUserAnalytics from "@/components/dashboard/admin/SubUserAnalytics";
import { UserRole } from "@prisma/client";

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

  // Count the number of users, excluding the current user
  const userCount = (await prisma.user.count()) - 1;

  // Count the number of lecturers (assuming their role is 'LECTURER')
  const lecturerCount = await prisma.user.count({
    where: {
      role: "LECTURE",
    },
  });

  // Count the number of students (assuming their role is 'STUDENT')
  const studentCount = await prisma.user.count({
    where: {
      role: "STUDENT",
    },
  });

  // Count the number of classes
  const classCount = await prisma.class.count();

  // Fetch all users (you can select specific fields if needed)
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true, // Assuming status like "active" is present
      createdAt: true, // Assuming createdAt is present
    },
  });

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
        {/* Pass the user data to SubUserAnalytics component */}
        <SubUserAnalytics users={users} />
      </main>
    </>
  );
};

export default action;
