import React from "react";
import { notFound, redirect } from "next/navigation";
import { getAuthSession } from "@/lib/nextauth";
import { UserRole } from "@prisma/client";
import { prisma } from "@/lib/db";
import PlayerList from "@/components/satistics/PlayerList";
import { Card } from "@/components/ui/card";

export const metadata = {
  title: "TEST GEN EDU | DNU",
  description: "Let's make a Quiz!",
};

type Props = {
  params: { testId: string };
};

const View = async ({ params }: Props) => {
  const { testId } = params;

  // Lấy phiên làm việc của người dùng
  const session = await getAuthSession();
  if (!session?.user) {
    redirect("/");
  }

  // Kiểm tra quyền của người dùng
  if (session.user.role !== UserRole.LECTURER) {
    redirect("/not-authorized");
    return null;
  }

  // Lấy thông tin của bài kiểm tra
  const test = await prisma.test.findUnique({
    where: { id: testId },
    select: { topic: true, testDuration: true, attemptsAllowed: true },
  });

  if (!test) {
    notFound();
  }

  // Lấy điểm từ lần thử cuối cùng của mỗi sinh viên
  const testResults = await prisma.testResult.findMany({
    where: {
      testId: testId,
    },
    orderBy: [{ studentId: "asc" }, { attemptNumber: "desc" }],
    distinct: ["studentId"],
    include: {
      student: true, // Bao gồm thông tin sinh viên
    },
  });

  console.log(testResults);

  return (
    <div className="p-8 mx-auto max-w-7xl">
      <Card className="p-6 mb-6 shadow-md">
        <h1 className="text-3xl font-bold mb-4">{test.topic}</h1>
        <div className="text-lg mb-2">
          Test Duration: {test.testDuration} minutes
        </div>
        <div className="text-lg">Attempts Allowed: {test.attemptsAllowed}</div>
      </Card>
      {testResults.length > 0 ? (
        <PlayerList testResults={testResults} />
      ) : (
        <p className="text-center text-lg text-gray-500 mt-6">
          No participants have taken this test yet.
        </p>
      )}
    </div>
  );
};

export default View;
