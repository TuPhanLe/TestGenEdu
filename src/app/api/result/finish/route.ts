import { NextResponse } from "next/server";
import { ZodError, z } from "zod";
import { getAuthSession } from "@/lib/nextauth";
import { prisma } from "@/lib/db";

// Define the schema for request validation
const updateTestResultSchema = z.object({
  testId: z.string(),
  startTime: z.string(), // ISO 8601 date string
  endTime: z.string().optional(), // Optional endTime
});

export const POST = async (req: Request) => {
  try {
    // Authenticate the user
    const session = await getAuthSession();
    if (!session?.user) {
      return NextResponse.json(
        { error: "You must be logged in" },
        { status: 401 }
      );
    }

    // Parse and validate the request body
    const body = await req.json();
    const { testId, startTime, endTime } = updateTestResultSchema.parse(body);

    // Find the test to get total number of questions
    const test = await prisma.test.findUnique({
      where: { id: testId },
      include: {
        questions: true, // Include related questions to get the total number of questions
      },
    });

    if (!test) {
      return NextResponse.json({ error: "Test not found" }, { status: 404 });
    }

    const totalQuestions = test.questions.length;
    const studentId = session.user.id;

    // Find the latest TestResult based on testId, studentId, and highest attemptNumber
    const latestTestResult = await prisma.testResult.findFirst({
      where: {
        testId: testId,
        studentId: studentId,
      },
      orderBy: {
        attemptNumber: "desc",
      },
    });

    if (!latestTestResult) {
      return NextResponse.json(
        { error: "TestResult not found" },
        { status: 404 }
      );
    }

    // Calculate number of correct answers and score
    const studentAnswers = latestTestResult.studentAnswers as {
      questionId: string;
      isCorrect: boolean;
      userAnswer: string;
    }[];

    const correctAnswersCount = studentAnswers.filter(
      (answer) => answer.isCorrect
    ).length;

    // Calculate score based on correct answers
    const score = (correctAnswersCount / totalQuestions) * 10; // Assuming a score out of 10
    const passed = score > 5; // Pass if score is above 5

    // Update the TestResult record
    const updatedTestResult = await prisma.testResult.update({
      where: {
        id: latestTestResult.id,
      },
      data: {
        startTime: new Date(startTime),
        endTime: endTime ? new Date(endTime) : null,
        score,
        totalScore: 10, // Assuming total score is 10
        passed,
        studentAnswers: studentAnswers, // Update studentAnswers
        attemptNumber: latestTestResult.attemptNumber, // Increment attemptNumber
      },
    });

    // Return a successful response
    return NextResponse.json(
      { message: "TestResult updated successfully", score },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating TestResult:", error);

    if (error instanceof ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    } else {
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
      );
    }
  }
};
