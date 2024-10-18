import { prisma } from "@/lib/db";
import { getAuthSession } from "@/lib/nextauth";
import { redirect } from "next/navigation";
import { TestType } from "@prisma/client";
import TestComponent from "@/components/forms/PlayGround/TestComponent";
import Countdown from "@/components/TimeDuration";

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
        questionId: question.id,
        question: question.question || "",
        answer: question.answer,
        options: JSON.parse(question.options as string) || [],
      })),
    })),
  };

  console.log("Formatted Test Data:", formattedTest);

  const existingResults = await prisma.testResult.findMany({
    where: {
      testId: testId,
      studentId: session.user.id,
    },
    orderBy: {
      attemptNumber: "desc",
    },
  });

  const nextAttemptNumber =
    existingResults.length > 0 ? existingResults[0].attemptNumber + 1 : 0;

  if (nextAttemptNumber >= formattedTest.attemptsAllowed) {
    return (
      <div>
        <h2>You have reached the maximum number of attempts.</h2>
      </div>
    );
  }

  // await prisma.testResult.create({
  //   data: {
  //     testId: testId,
  //     studentId: session.user.id,
  //     studentAnswers: [],
  //     startTime: new Date(),
  //     totalScore: 10, // Assuming total score is 10
  //     attemptNumber: nextAttemptNumber,
  //   },
  // });

  return (
    <>
      <TestComponent
        test={formattedTest}
        timeStarted={new Date()}
        attemptNumber={nextAttemptNumber}
      />
      {/* <Countdown timeDuration={2000} /> */}
    </>
  );
};

export default TestPage;
