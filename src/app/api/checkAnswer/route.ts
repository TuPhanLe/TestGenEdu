import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { checkAnswerSchema, testSchema } from "@/schemas/form/test";
import { prisma } from "@/lib/db";
import { getAuthSession } from "@/lib/nextauth"; // Adjust the path as needed

type StudentAnswer = {
  questionId: string;
  userAnswer: string;
  isCorrect: boolean;
};

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in to submit your answer." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { questionId, userInput } = checkAnswerSchema.parse(body);

    const question = await prisma.question.findUnique({
      where: { id: questionId },
    });

    if (!question) {
      return NextResponse.json(
        { error: "Question not found" },
        { status: 404 }
      );
    }

    // Find the most recent TestResult for this student and test
    const testResult = await prisma.testResult.findFirst({
      where: {
        testId: question.testId!,
        studentId: session.user.id,
      },
      orderBy: {
        attemptNumber: "desc", // Get the latest attempt
      },
    });

    if (!testResult) {
      return NextResponse.json(
        { error: "Test result not found" },
        { status: 404 }
      );
    }

    const isCorrect =
      question.answer.toLowerCase().trim() === userInput.toLowerCase().trim();

    // Ensure studentAnswers is treated as an array
    const currentStudentAnswers: StudentAnswer[] = Array.isArray(
      testResult.studentAnswers
    )
      ? (testResult.studentAnswers as StudentAnswer[])
      : [];

    // Update the studentAnswers by adding the current answer
    const updatedStudentAnswers: StudentAnswer[] = [
      ...currentStudentAnswers,
      {
        questionId: questionId,
        userAnswer: userInput,
        isCorrect: isCorrect,
      },
    ];

    await prisma.testResult.update({
      where: {
        id: testResult.id,
      },
      data: {
        studentAnswers: updatedStudentAnswers,
      },
    });

    return NextResponse.json(
      {
        isCorrect,
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
