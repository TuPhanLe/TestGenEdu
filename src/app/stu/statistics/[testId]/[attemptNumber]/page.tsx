import AccuracyCard from "@/components/satistics/AccuracyCard";
import QuestionList from "@/components/satistics/QuestionList";
import ResultCard from "@/components/satistics/ResultCard";
import TimeTakenCard from "@/components/satistics/TimeTakenCard";

import { prisma } from "@/lib/db";
import { getAuthSession } from "@/lib/nextauth";
import { LucideLayoutDashboard } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

type Props = {
  params: {
    testId: string;
    attemptNumber: string;
  };
};

const Statistics = async ({ params: { testId, attemptNumber } }: Props) => {
  const session = await getAuthSession();
  if (!session?.user) {
    return redirect("/");
  }

  const testResult = await prisma.testResult.findUnique({
    where: {
      testId_studentId_attemptNumber: {
        testId,
        studentId: session.user.id,
        attemptNumber: parseInt(attemptNumber),
      },
    },
    include: {
      test: {
        include: { questions: true },
      },
    },
  });

  if (!testResult) {
    return redirect("/");
  }

  const { test, studentAnswers } = testResult;

  const parsedAnswers = Array.isArray(studentAnswers)
    ? (studentAnswers as Array<{ isCorrect?: boolean }>)
    : [];

  const totalCorrect = parsedAnswers.filter(
    (answer) => answer.isCorrect
  ).length;

  const accuracy =
    test.questions.length > 0
      ? (totalCorrect / test.questions.length) * 100
      : 0;

  return (
    <div className="p-8 mx-auto max-w-7xl">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Summary</h2>
        <div className="flex items-center space-x-2">
          <Link
            href="/stu/dashboard"
            className="px-4 py-2 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-600"
          >
            <LucideLayoutDashboard className="inline-block mr-2" />
            <button>Back to Dashboard</button>
          </Link>
        </div>
      </div>

      <div className="grid gap-4 mt-4 md:grid-cols-7">
        <ResultCard accuracy={accuracy} />
        <AccuracyCard accuracy={accuracy} />
        <TimeTakenCard
          timeEnded={new Date(testResult.endTime ?? 0)}
          timeStarted={new Date(testResult.startTime)}
        />
      </div>
      <QuestionList question={test.questions} />
    </div>
  );
};

export default Statistics;
