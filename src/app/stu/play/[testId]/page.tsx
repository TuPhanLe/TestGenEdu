import { prisma } from "@/lib/db";
import { getAuthSession } from "@/lib/nextauth";
import { redirect } from "next/navigation";
import { TestType } from "@prisma/client";
import TestComponent from "@/components/forms/PlayGround/TestComponent";
import Countdown from "@/components/TimeDuration";
import { AlertCircle, LucideLayoutDashboard } from "lucide-react";
import Link from "next/link";

type Props = {
  params: {
    testId: string;
  };
};

const TestPage = async ({ params: { testId } }: Props) => {
  const session = await getAuthSession();
  if (!session) {
    redirect("/");
  }

  const test = await prisma.test.findUnique({
    where: {
      id: testId,
    },
    include: {
      parts: {
        include: {
          questions: true,
        },
      },
    },
  });

  if (!test) {
    return redirect("/quiz");
  }

  const formattedTest = {
    testId: test.id,
    topic: test.topic,
    testDuration: test.testDuration ?? 60,
    attemptsAllowed: test.attemptsAllowed ?? 1,
    parts: test.parts.map((part) => ({
      partId: part.id,
      paragraph: part.content || "",
      type: part.testType,
      questions: part.questions.map((question) => ({
        outcome: question.outcome,
        questionId: question.id,
        question: question.question || "",
        answer: question.answer,
        options: JSON.parse(question.options as string) || [],
      })),
    })),
  };

  const existingResults = await prisma.testResult.findMany({
    where: {
      testId: testId,
      studentId: session.user.id,
    },
    orderBy: {
      attemptNumber: "desc",
    },
  });

  let nextAttemptNumber;
  let timeStarted;
  let shouldCreateNewRecord = true;

  if (existingResults.length > 0) {
    // Kiểm tra nếu lần làm bài gần nhất chưa kết thúc
    if (existingResults[0].endTime === null) {
      nextAttemptNumber = existingResults[0].attemptNumber; // Giữ nguyên số lần làm bài
      timeStarted = existingResults[0].startTime; // Lấy thời gian bắt đầu từ lần làm bài gần nhất
      shouldCreateNewRecord = false; // Không tạo thêm bản ghi mới
    } else {
      nextAttemptNumber = existingResults[0].attemptNumber + 1; // Tăng số lần làm bài nếu đã hoàn thành
      timeStarted = new Date(); // Thời gian bắt đầu mới
    }
  } else {
    nextAttemptNumber = 1; // Nếu chưa có lần làm bài nào
    timeStarted = new Date(); // Thời gian bắt đầu mới
  }

  if (nextAttemptNumber >= formattedTest.attemptsAllowed + 1) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-4 bg-gray-100">
        <div className="flex flex-col items-center p-6 rounded-lg shadow-md max-w-lg">
          <AlertCircle className="text-red-500 w-12 h-12 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Maximum Attempts Reached
          </h2>
          <p className="text-gray-600 mb-4 text-center">
            You have reached the maximum number of attempts allowed for this
            test. Please contact your instructor or administrator for further
            assistance.
          </p>
          <Link
            href="/stu/dashboard"
            className="px-4 py-2 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-600"
          >
            <LucideLayoutDashboard className="inline-block mr-2" />
            <button>Back to Dashboard</button>
          </Link>
        </div>
      </div>
    );
  }

  if (shouldCreateNewRecord) {
    await prisma.testResult.create({
      data: {
        testId: testId,
        studentId: session.user.id,
        studentAnswers: [],
        startTime: timeStarted,
        totalScore: 10, // Assuming total score is 10
        attemptNumber: nextAttemptNumber,
      },
    });
  }
  return (
    <>
      <TestComponent
        test={formattedTest}
        timeStarted={timeStarted}
        attemptNumber={nextAttemptNumber}
      />
    </>
  );
};

export default TestPage;
