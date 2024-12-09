import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { getAuthSession } from "@/lib/nextauth";
import { prisma } from "@/lib/db";
import { testSchema } from "@/schemas/form/test";

export const PUT = async (req: Request) => {
  try {
    // Lấy thông tin người dùng từ session
    const session = await getAuthSession();
    if (!session?.user) {
      return NextResponse.json(
        { error: "You must be logged in" },
        { status: 401 }
      );
    }

    // Parse và validate dữ liệu từ body request
    const body = await req.json();
    const { testId, topic, testDuration, attemptsAllowed, folderId, parts } =
      testSchema.parse(body);

    // Cập nhật thông tin bài kiểm tra
    const updatedTest = await prisma.test.update({
      where: { id: testId },
      data: {
        topic,
        testDuration,
        attemptsAllowed,
        folderId,
        creatorId: session.user.id,
      },
    });

    // Lấy tất cả các `part` và `question` hiện tại từ DB
    const existingParts = await prisma.part.findMany({
      where: { testId },
      include: { questions: true },
    });

    // **Bước 1: Xóa các phần (part) và câu hỏi (question) đã bị xóa trên frontend**
    const partIdsFromFrontend = parts.map((part) => part.partId);
    const partsToDelete = existingParts.filter(
      (existingPart) => !partIdsFromFrontend.includes(existingPart.id)
    );

    const deletePartPromises = partsToDelete.map((part) =>
      prisma.part.delete({ where: { id: part.id } })
    );

    // **Xóa các câu hỏi đã bị xóa trong từng phần**
    const deleteQuestionPromises = existingParts.flatMap((part) => {
      const questionIdsFromFrontend =
        parts
          .find((p) => p.partId === part.id)
          ?.questions.map((q) => q.questionId) || [];

      return part.questions
        .filter((q) => !questionIdsFromFrontend.includes(q.id))
        .map((q) => prisma.question.delete({ where: { id: q.id } }));
    });

    await Promise.all([...deletePartPromises, ...deleteQuestionPromises]);

    // **Bước 2: Upsert các phần và câu hỏi từ frontend**
    const partPromises = parts.map(async (part) => {
      const updatedPart = await prisma.part.upsert({
        where: { id: part.partId },
        update: {
          content: part.paragraph || "",
          testType: part.type,
          testId: updatedTest.id,
        },
        create: {
          id: part.partId,
          content: part.paragraph || "",
          testType: part.type,
          testId: updatedTest.id,
        },
      });

      const questionPromises = part.questions.map((question) =>
        prisma.question.upsert({
          where: { id: question.questionId },
          update: {
            question: question.question || "",
            answer: question.answer,
            options: question.options ? JSON.stringify(question.options) : "[]",
            questionType: part.type,
            partId: updatedPart.id,
            testId: updatedTest.id,
            outcome: question.outcome,
          },
          create: {
            id: question.questionId,
            question: question.question || "",
            answer: question.answer,
            options: question.options ? JSON.stringify(question.options) : "[]",
            questionType: part.type,
            partId: updatedPart.id,
            testId: updatedTest.id,
            outcome: question.outcome,
          },
        })
      );

      await Promise.all(questionPromises);
    });

    await Promise.all(partPromises);

    // Trả về kết quả sau khi cập nhật thành công
    return NextResponse.json(
      {
        message: "Test updated successfully",
        testId: updatedTest.id,
        creatorId: updatedTest.creatorId,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating test:", error);

    if (error instanceof ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
};
