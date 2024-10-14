import MCQ from "@/components/MCQ";
import { prisma } from "@/lib/db";
import { getAuthSession } from "@/lib/nextauth";
import { redirect } from "next/navigation";
import React from "react";

type Props = {
  params: {
    testId: string;
  };
};

const MCQpage = async ({ params: { testId } }: Props) => {
  const session = await getAuthSession();
  if (!session) {
    redirect("/");
  }

  // Fetch the test details with attemptsAllowed, part, and questions
  const test = await prisma.test.findUnique({
    where: {
      id: testId,
    },
    include: {
      parts: {
        select: {
          id: true,
          content: true,
          questions: {
            select: {
              id: true,
              question: true,
              options: true,
            },
          },
        },
      },
    },
  });

  if (!test || test.testType !== "mcq") {
    return redirect("/quiz");
  }

  const attemptsAllowed = test.attemptsAllowed ?? 1;

  // Check if the TestAccess already exists for the user
  const existingAccess = await prisma.testAccess.findUnique({
    where: {
      testId_userId: {
        testId: test.id,
        userId: session.user.id,
      },
    },
  });

  if (!existingAccess) {
    // If it doesn't exist, create a new TestAccess record
    await prisma.testAccess.create({
      data: {
        testId: test.id,
        userId: session.user.id,
        accessLevel: "play", // Adjust access level as needed
      },
    });
  }

  const existingResults = await prisma.testResult.findMany({
    where: {
      testId: testId,
      studentId: session.user.id,
    },
    orderBy: {
      attemptNumber: "desc", // Get the latest attempt
    },
  });
  const nextAttemptNumber =
    existingResults.length > 0 ? existingResults[0].attemptNumber + 1 : 0;
  // Check if the user has exceeded the allowed attempts
  if (nextAttemptNumber >= attemptsAllowed) {
    return (
      <div>
        <h2>
          Error: You have reached the maximum number of attempts for this test.
        </h2>
      </div>
    );
  }
  // If the TestResult doesn't exist, create a new one with the first attempt
  await prisma.testResult.create({
    data: {
      testId: testId,
      studentId: session.user.id,
      studentAnswers: [], // Initialize studentAnswers as an empty array
      startTime: new Date(),
      totalScore: 10, // Assuming total score is 10
      attemptNumber: nextAttemptNumber,
    },
  });

  return (
    <MCQ
      game={test}
      timeStarted={new Date()}
      attemptNumber={nextAttemptNumber}
    />
  );
};

export default MCQpage;
